require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const replacements = [
  { viewId: 49, fileName: 'ninh-kieu-park-360-v2.png' },
  { viewId: 50, fileName: 'ninh-kieu-footbridge-360-v2.png' },
];

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object storage is not configured');
  const client = await db.getClient();
  const results = [];

  try {
    for (const replacement of replacements) {
      const localFile = path.resolve(__dirname, '..', '..', 'travellens-fe', 'public', 'view360-generated', replacement.fileName);
      const buffer = await fs.readFile(localFile);
      const upload = await objectStorage.uploadFile({
        file: { buffer, originalname: replacement.fileName, mimetype: 'image/png' },
        folder: 'view360-images',
        fallbackName: `view360-${replacement.viewId}`,
      });

      await client.query('BEGIN');
      try {
        const image = (await client.query(
          `UPDATE view360_image
           SET image_file = $1, updated_at = CURRENT_TIMESTAMP
           WHERE image_id = (
             SELECT image_id FROM view360_image
             WHERE view_id = $2 AND deleted_at IS NULL
             ORDER BY order_index ASC NULLS LAST, image_id ASC
             LIMIT 1
           )
           RETURNING image_id, view_id, image_file`,
          [upload.url, replacement.viewId]
        )).rows[0];
        if (!image) throw new Error(`No active image found for View360 ${replacement.viewId}`);
        await client.query('COMMIT');
        results.push(image);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    console.log(JSON.stringify({ success: true, results }, null, 2));
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
