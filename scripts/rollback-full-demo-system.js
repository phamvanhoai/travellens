require('dotenv').config();

const db = require('../src/config/db');

const MARKER = '[TRAVELLENS-DEMO-2026]';
const DEMO_EMAILS = [
  'demo.admin@travellens.vn',
  'demo.staff@travellens.vn',
  'demo.customer1@travellens.vn',
  'demo.customer2@travellens.vn',
  'demo.customer3@travellens.vn',
];

async function remove(client, table, where, params) {
  const result = await client.query(`DELETE FROM ${table} WHERE ${where}`, params);
  return result.rowCount;
}

async function run() {
  const client = await db.getClient();
  const deleted = {};

  try {
    await client.query('BEGIN');

    // Delete roots with RESTRICT foreign keys first. Their children cascade.
    deleted.group_trips = await remove(client, 'group_trip', 'description LIKE $1', [`${MARKER}%`]);
    deleted.blogs = await remove(client, 'blog', "slug IN ('demo-blog-1-2026','demo-blog-2-2026','demo-blog-3-2026') AND content LIKE $1", [`%${MARKER}%`]);
    deleted.travel_posts = await remove(client, 'travel_post', 'content LIKE $1', [`${MARKER}%`]);
    deleted.tours = await remove(client, 'tour', 'description LIKE $1', [`${MARKER}%`]);
    deleted.locations = await remove(client, 'location', 'description LIKE $1', [`${MARKER}%`]);
    deleted.destinations = await remove(client, 'travel_destination', 'description LIKE $1', [`${MARKER}%`]);
    deleted.coupons = await remove(client, 'coupon', "code = 'DEMO2026' AND description LIKE $1", [`${MARKER}%`]);
    deleted.tour_content_items = await remove(client, 'tour_content_item', 'content LIKE $1', [`${MARKER}%`]);
    deleted.blog_categories = await remove(client, 'blog_category', 'description LIKE $1', [`${MARKER}%`]);
    deleted.tour_categories = await remove(client, 'tour_category', 'description LIKE $1', [`${MARKER}%`]);
    deleted.destination_categories = await remove(client, 'destination_category', 'description LIKE $1', [`${MARKER}%`]);
    deleted.users = await remove(client, 'users', 'email = ANY($1::text[]) AND profile_info LIKE $2', [DEMO_EMAILS, `${MARKER}%`]);

    await client.query('COMMIT');
    console.log(JSON.stringify({ success: true, marker: MARKER, deleted }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
