require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const objectStorage = require('../src/services/objectStorage.service');

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

const files = [
  {
    localUrl: '/public/locations/1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg',
    diskPath: path.join(__dirname, '..', 'public', 'locations', '1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg'),
    mime: 'image/jpeg',
  },
  {
    localUrl: '/public/locations/1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg',
    diskPath: path.join(__dirname, '..', 'public', 'locations', '1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg'),
    mime: 'image/jpeg',
  },
  {
    localUrl: '/public/reviews/1779895714183-screenshot_1773716998.png',
    diskPath: path.join(__dirname, '..', 'public', 'reviews', '1779895714183-screenshot_1773716998.png'),
    mime: 'image/png',
  },
  {
    localUrl: '/public/maps/1779810494214-Screenshot-2026-03-16-073932.png',
    diskPath: path.join(__dirname, '..', 'public', 'maps', '1779810494214-Screenshot-2026-03-16-073932.png'),
    mime: 'image/png',
  },
  {
    localUrl: '/public/users/1780589724233-images.jpg',
    diskPath: path.join(__dirname, '..', 'public', 'users', '1780589724233-images.jpg'),
    mime: 'image/jpeg',
  },
];

const uploadOne = async (entry) => {
  const buffer = fs.readFileSync(entry.diskPath);
  const uploaded = await objectStorage.uploadFile({
    file: {
      originalname: path.basename(entry.diskPath),
      mimetype: entry.mime,
      buffer,
    },
    folder: 'travel-feed',
    fallbackName: 'travel-feed-sample',
  });

  return {
    localUrl: entry.localUrl,
    objectUrl: uploaded.url,
  };
};

const run = async () => {
  if (!objectStorage.isEnabled) {
    throw new Error('Object Storage is not configured. Please set OBJECT_STORAGE_* env variables first.');
  }

  const client = await pool.connect();

  try {
    const remainingLocal = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post_photo
       WHERE image_url LIKE '/public/%'`
    );

    if (remainingLocal.rows[0].total === 0) {
      console.log(JSON.stringify({
        success: true,
        skipped: true,
        message: 'Travel feed sample images already use Object Storage URLs',
      }, null, 2));
      return;
    }

    const uploaded = [];

    for (const entry of files) {
      const exists = await client.query(
        `SELECT 1
         FROM travel_post_photo
         WHERE image_url = $1
         LIMIT 1`,
        [entry.localUrl]
      );

      if (exists.rowCount === 0 && entry.localUrl !== '/public/users/1780589724233-images.jpg') {
        continue;
      }

      uploaded.push(await uploadOne(entry));
    }

    await client.query('BEGIN');

    for (const item of uploaded) {
      await client.query(
        `UPDATE travel_post_photo
         SET image_url = $1
         WHERE image_url = $2`,
        [item.objectUrl, item.localUrl]
      );

      await client.query(
        `UPDATE users
         SET avatar_url = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE avatar_url = $2`,
        [item.objectUrl, item.localUrl]
      );

      await client.query(
        `UPDATE travel_destination
         SET thumbnail = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE thumbnail = $2`,
        [item.objectUrl, item.localUrl]
      );

      await client.query(
        `UPDATE location
         SET thumbnail = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE thumbnail = $2`,
        [item.objectUrl, item.localUrl]
      );
    }

    await client.query('COMMIT');

    console.log(JSON.stringify({
      success: true,
      uploaded: uploaded.length,
      urls: uploaded,
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
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
