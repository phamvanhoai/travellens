require('dotenv').config();

const path = require('path');
const sharp = require('sharp');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const QUALITY = Number(process.env.VIEW360_WEBP_QUALITY || 85);

const isWebpUrl = (value) => {
  try {
    return path.extname(new URL(value).pathname).toLowerCase() === '.webp';
  } catch {
    return path.extname(String(value || '')).toLowerCase() === '.webp';
  }
};

const download = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Download returned HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object Storage is not configured');

  const result = await db.query(
    `SELECT image_id, image_file
     FROM view360_image
     WHERE deleted_at IS NULL
       AND NULLIF(BTRIM(image_file), '') IS NOT NULL
     ORDER BY image_id`
  );
  const images = result.rows.filter((image) => !isWebpUrl(image.image_file));
  let originalBytes = 0;
  let webpBytes = 0;
  let converted = 0;

  for (const [index, image] of images.entries()) {
    try {
      const source = await download(image.image_file);
      const output = await sharp(source)
        .rotate()
        .webp({ quality: QUALITY, effort: 4, smartSubsample: true })
        .toBuffer();
      const uploaded = await objectStorage.uploadFile({
        file: {
          buffer: output,
          originalname: `view360-${image.image_id}.webp`,
          mimetype: 'image/webp',
        },
        folder: 'view360-images',
        fallbackName: `view360-${image.image_id}`,
      });
      const updated = await db.query(
        `UPDATE view360_image
         SET image_file = $1, updated_at = CURRENT_TIMESTAMP
         WHERE image_id = $2 AND image_file = $3 AND deleted_at IS NULL
         RETURNING image_id`,
        [uploaded.url, image.image_id, image.image_file]
      );
      if (!updated.rowCount) throw new Error('Record changed during conversion; database was not updated');

      originalBytes += source.length;
      webpBytes += output.length;
      converted += 1;
      console.log(`[${index + 1}/${images.length}] View360 image ${image.image_id}: ${source.length} -> ${output.length} bytes`);
    } catch (error) {
      console.error(`[${index + 1}/${images.length}] View360 image ${image.image_id} failed: ${error.message}`);
    }
  }

  const reduction = originalBytes > 0
    ? Math.round((1 - webpBytes / originalBytes) * 1000) / 10
    : 0;
  console.log(JSON.stringify({ converted, failed: images.length - converted, originalBytes, webpBytes, reductionPercent: reduction }));
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
