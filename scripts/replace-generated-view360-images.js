require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const replacements = [
  { viewId: 49, fileName: 'ninh-kieu-park-360-v2.png' },
  { viewId: 50, fileName: 'ninh-kieu-footbridge-360-v2.png' },
  { viewId: 51, fileName: 'view-51-cai-rang-floating-market-dock.png' },
  { viewId: 52, fileName: 'view-52-cai-rang-food-boats.png' },
  { viewId: 53, fileName: 'view-53-binh-thuy-main-house.png' },
  { viewId: 54, fileName: 'view-54-binh-thuy-orchid-garden.png' },
  { viewId: 55, fileName: 'view-55-truc-lam-phuong-nam-main-hall.png' },
  { viewId: 56, fileName: 'view-56-truc-lam-phuong-nam-zen-garden.png' },
  { viewId: 57, fileName: 'view-57-con-son-fruit-garden.png' },
  { viewId: 58, fileName: 'view-58-con-son-folk-cake-area.png' },
];

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object storage is not configured');
  const client = await db.getClient();
  const results = [];

  try {
    const requestedIds = new Set(process.argv.slice(2).map(Number).filter(Number.isInteger));
    const selected = requestedIds.size
      ? replacements.filter(({ viewId }) => requestedIds.has(viewId))
      : replacements;
    if (!selected.length) throw new Error('No matching View360 replacements');

    for (const replacement of selected) {
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
