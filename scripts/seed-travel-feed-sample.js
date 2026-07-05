require('dotenv').config();

const { Pool } = require('pg');

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const sslConfig = shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {};

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...sslConfig,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'travel360',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ...sslConfig,
    };

const pool = new Pool(config);

const SAMPLE_MARKER = '[travel-feed-sample]';

const samplePhotos = [
  '/public/locations/1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg',
  '/public/locations/1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg',
  '/public/reviews/1779895714183-screenshot_1773716998.png',
  '/public/maps/1779810494214-Screenshot-2026-03-16-073932.png',
];

const ensureCustomer = async (client, index) => {
  const existing = await client.query(
    `SELECT user_id, name
     FROM users
     WHERE role = 'customer'
       AND status = 'active'
     ORDER BY user_id
     OFFSET $1
     LIMIT 1`,
    [index]
  );

  if (existing.rows[0]) return existing.rows[0];

  const email = `travel.feed.demo.${index + 1}@example.com`;
  const result = await client.query(
    `INSERT INTO users (name, email, password, role, status, avatar_url, profile_info)
     VALUES ($1, $2, NULL, 'customer', 'active', $3, $4)
     ON CONFLICT (email) DO UPDATE
       SET role = 'customer',
           status = 'active',
           avatar_url = EXCLUDED.avatar_url,
           updated_at = CURRENT_TIMESTAMP
     RETURNING user_id, name`,
    [
      index === 0 ? 'Travel Feed Demo One' : 'Travel Feed Demo Two',
      email,
      '/public/users/1780589724233-images.jpg',
      'Sample customer for Travel Feed demo data',
    ]
  );

  return result.rows[0];
};

const ensureDestinationAndLocation = async (client) => {
  let destination = (await client.query(
    `SELECT destination_id, name
     FROM travel_destination
     WHERE deleted_at IS NULL
     ORDER BY destination_id
     LIMIT 1`
  )).rows[0];

  if (!destination) {
    const category = (await client.query(
      `INSERT INTO destination_category (name, description)
       VALUES ('Travel Feed Demo Category', 'Category for sample travel feed data')
       ON CONFLICT (name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING destination_category_id`
    )).rows[0];

    destination = (await client.query(
      `INSERT INTO travel_destination (
          name,
          description,
          thumbnail,
          latitude,
          longitude,
          destination_category_id
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING destination_id, name`,
      [
        'Travel Feed Demo Destination',
        'Destination for sample travel feed data',
        samplePhotos[0],
        10.7769,
        106.7009,
        category.destination_category_id,
      ]
    )).rows[0];
  }

  let location = (await client.query(
    `SELECT location_id, name
     FROM location
     WHERE deleted_at IS NULL
       AND is_deleted = FALSE
       AND destination_id = $1
     ORDER BY location_id
     LIMIT 1`,
    [destination.destination_id]
  )).rows[0];

  if (!location) {
    location = (await client.query(
      `INSERT INTO location (
          name,
          latitude,
          longitude,
          description,
          thumbnail,
          destination_id
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING location_id, name`,
      [
        'Travel Feed Demo Location',
        10.7769,
        106.7009,
        'Location for sample travel feed data',
        samplePhotos[1],
        destination.destination_id,
      ]
    )).rows[0];
  }

  return { destination, location };
};

const insertPost = async (client, payload) => {
  const result = await client.query(
    `INSERT INTO travel_post (
        user_id,
        content,
        destination_id,
        location_id,
        status,
        visibility
     )
     VALUES ($1, $2, $3, $4, 'published', 'public')
     RETURNING post_id, content`,
    [payload.user_id, payload.content, payload.destination_id, payload.location_id]
  );

  const post = result.rows[0];

  for (const [index, imageUrl] of payload.photos.entries()) {
    await client.query(
      `INSERT INTO travel_post_photo (post_id, image_url, display_order)
       VALUES ($1, $2, $3)`,
      [post.post_id, imageUrl, index]
    );
  }

  for (const likedBy of payload.likedBy) {
    await client.query(
      `INSERT INTO travel_post_like (post_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING`,
      [post.post_id, likedBy]
    );
  }

  for (const comment of payload.comments) {
    await client.query(
      `INSERT INTO travel_post_comment (post_id, user_id, content)
       VALUES ($1, $2, $3)`,
      [post.post_id, comment.user_id, comment.content]
    );
  }

  await client.query(
    `UPDATE travel_post
     SET like_count = (
           SELECT COUNT(*)::int
           FROM travel_post_like
           WHERE post_id = $1
         ),
         comment_count = (
           SELECT COUNT(*)::int
           FROM travel_post_comment
           WHERE post_id = $1
             AND deleted_at IS NULL
             AND status = 'published'
         ),
         report_count = (
           SELECT COUNT(*)::int
           FROM travel_post_report
           WHERE post_id = $1
         ),
         updated_at = CURRENT_TIMESTAMP
     WHERE post_id = $1`,
    [post.post_id]
  );

  return post;
};

const run = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existingSample = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post
       WHERE content LIKE $1
         AND deleted_at IS NULL`,
      [`%${SAMPLE_MARKER}%`]
    );

    if (existingSample.rows[0].total > 0) {
      await client.query('COMMIT');
      console.log(JSON.stringify({
        success: true,
        skipped: true,
        message: 'Sample travel feed posts already exist',
        existing: existingSample.rows[0].total,
      }, null, 2));
      return;
    }

    const customerOne = await ensureCustomer(client, 0);
    const customerTwo = await ensureCustomer(client, 1);
    const { destination, location } = await ensureDestinationAndLocation(client);

    const posts = [
      await insertPost(client, {
        user_id: customerOne.user_id,
        destination_id: destination.destination_id,
        location_id: location.location_id,
        content: `${SAMPLE_MARKER} Buoi sang o ${location.name} rat dep, anh sang vua du de chup may tam hinh ky niem.`,
        photos: [samplePhotos[0], samplePhotos[1]],
        likedBy: [customerTwo.user_id],
        comments: [
          {
            user_id: customerTwo.user_id,
            content: 'Dia diem nay nhin rat hop de di cuoi tuan.',
          },
        ],
      }),
      await insertPost(client, {
        user_id: customerTwo.user_id,
        destination_id: destination.destination_id,
        location_id: location.location_id,
        content: `${SAMPLE_MARKER} Minh vua ghe ${destination.name}, khong gian thoang va co nhieu goc chup anh.`,
        photos: [samplePhotos[2]],
        likedBy: [customerOne.user_id],
        comments: [
          {
            user_id: customerOne.user_id,
            content: 'Cam on ban da chia se, minh se luu lai cho lich trinh sau.',
          },
        ],
      }),
      await insertPost(client, {
        user_id: customerOne.user_id,
        destination_id: destination.destination_id,
        location_id: location.location_id,
        content: `${SAMPLE_MARKER} Goi y nho: nen di som de tranh dong va co thoi gian xem het cac khu vuc chinh.`,
        photos: [samplePhotos[3]],
        likedBy: [customerTwo.user_id, customerOne.user_id],
        comments: [],
      }),
    ];

    await client.query('COMMIT');

    console.log(JSON.stringify({
      success: true,
      inserted_posts: posts.map((post) => post.post_id),
      customers: [customerOne, customerTwo],
      destination,
      location,
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
