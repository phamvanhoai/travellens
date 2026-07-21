require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const replacements = [
  { viewId: 2, fileName: 'view-2-fpt-can-tho-gamma-building.png' },
  { viewId: 3, fileName: 'view-3-independence-palace-main-gate.png' },
  { viewId: 4, fileName: 'view-4-nha-rong-wharf-river-courtyard.png' },
  { viewId: 5, fileName: 'view-5-fpt-can-tho-introduction-area.png' },
  { viewId: 6, fileName: 'view-6-fpt-can-tho-alpha-lobby.png' },
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
  { viewId: 119, fileName: 'view-119-khue-van-cac.png' },
  { viewId: 120, fileName: 'view-120-temple-literature-thai-hoc.png' },
  { viewId: 121, fileName: 'view-121-doan-mon.png' },
  { viewId: 122, fileName: 'view-122-hoang-dieu-archaeology.png' },
  { viewId: 123, fileName: 'view-123-ngo-mon-hue.png' },
  { viewId: 124, fileName: 'view-124-thai-hoa-palace-hue.png' },
  { viewId: 125, fileName: 'view-125-phuoc-duyen-tower.png' },
  { viewId: 126, fileName: 'view-126-thien-mu-dai-hung-hall.png' },
  { viewId: 127, fileName: 'view-127-hoi-an-japanese-bridge.png' },
  { viewId: 128, fileName: 'view-128-hoi-an-fujian-assembly-hall.png' },
  { viewId: 129, fileName: 'view-129-ba-na-golden-bridge.png' },
  { viewId: 130, fileName: 'view-130-ba-na-french-village.png' },
  { viewId: 131, fileName: 'view-131-ben-thanh-south-gate.png' },
  { viewId: 132, fileName: 'view-132-ben-thanh-food-court.png' },
  { viewId: 133, fileName: 'view-133-hcm-fine-arts-main-building.png' },
  { viewId: 134, fileName: 'view-134-hcm-modern-art-gallery.png' },
  { viewId: 135, fileName: 'view-135-ba-den-ba-temple.png' },
  { viewId: 136, fileName: 'view-136-ba-den-van-son-summit.png' },
  { viewId: 137, fileName: 'view-137-tram-chim-bird-observation.png' },
  { viewId: 138, fileName: 'view-138-tram-chim-forest-boat-route.png' },
  { viewId: 139, fileName: 'view-139-bai-sao-central-beach.png' },
  { viewId: 140, fileName: 'view-140-bai-sao-kayak-area.png' },
  { viewId: 141, fileName: 'view-141-phu-quoc-prison-museum.png' },
  { viewId: 142, fileName: 'view-142-phu-quoc-prison-reconstruction.png' },
  { viewId: 143, fileName: 'view-143-ham-ninh-pier.png' },
  { viewId: 144, fileName: 'view-144-ham-ninh-seafood-area.png' },
  { viewId: 145, fileName: 'view-145-cat-tien-bau-sau.png' },
  { viewId: 146, fileName: 'view-146-cat-tien-ancient-tree-trail.png' },
  { viewId: 147, fileName: 'view-147-saigon-opera-house-lobby.png' },
  { viewId: 148, fileName: 'view-148-saigon-opera-house-auditorium.png' },
  { viewId: 149, fileName: 'view-149-ong-de-folk-games-v2.png' },
  { viewId: 150, fileName: 'view-150-independence-palace-reception-hall-v2.png' },
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
