require('dotenv').config();

const path = require('path');
const sharp = require('sharp');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const QUALITY = Number(process.env.CONTENT_WEBP_QUALITY || 85);
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

const sources = [
  { name: 'destinations', table: 'travel_destination', id: 'destination_id', column: 'thumbnail', folder: 'travel-destinations', where: 'deleted_at IS NULL' },
  { name: 'locations', table: 'location', id: 'location_id', column: 'thumbnail', folder: 'locations', where: 'deleted_at IS NULL' },
  { name: 'tours', table: 'tour', id: 'tour_id', column: 'thumbnail', folder: 'tours', where: 'deleted_at IS NULL' },
  { name: 'blogs', table: 'blog', id: 'blog_id', column: 'thumbnail', folder: 'blogs', where: 'TRUE' },
  { name: 'travel-feed', table: 'travel_post_photo', id: 'photo_id', column: 'image_url', folder: 'travel-feed', where: 'deleted_at IS NULL' },
  { name: 'media', table: 'media_file', id: 'media_id', column: 'file_url', folder: 'media', where: 'deleted_at IS NULL', metadata: true },
  { name: 'reviews', table: 'review_photo', id: 'photo_id', column: 'photo_url', folder: 'reviews', where: 'deleted_at IS NULL', metadata: true },
];

const isAbsoluteHttpUrl = (value) => /^https?:\/\//i.test(String(value || ''));
const isCloudflyWebp = (value) => {
  try {
    const url = new URL(value);
    return url.hostname === 's3.cloudfly.vn' && path.extname(url.pathname).toLowerCase() === '.webp';
  } catch {
    return false;
  }
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function download(url) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TravelLens/1.0 image migration (contact: admin@travellens.local)',
          Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(60_000),
      });
      if (response.status === 429 && attempt < 5) {
        const retryAfter = Number(response.headers.get('retry-after') || 0) * 1000;
        await wait(Math.max(retryAfter, attempt * 5000));
        continue;
      }
      if (!response.ok) throw new Error(`download returned HTTP ${response.status}`);
      const declaredSize = Number(response.headers.get('content-length') || 0);
      if (declaredSize > MAX_SOURCE_BYTES) throw new Error('source image exceeds 25 MB');
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length || buffer.length > MAX_SOURCE_BYTES) throw new Error('invalid source image size');
      return buffer;
    } catch (error) {
      lastError = error;
      if (attempt < 5 && !String(error.message).includes('HTTP 4')) {
        await wait(attempt * 2000);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

async function migrateRecord(source, record, migratedUrls) {
  const oldUrl = record.url;
  let migrated = migratedUrls.get(oldUrl);

  if (!migrated) {
    const input = await download(oldUrl);
    const output = await sharp(input)
      .rotate()
      .webp({ quality: QUALITY, effort: 4, smartSubsample: true })
      .toBuffer();
    const uploaded = await objectStorage.uploadFile({
      file: {
        buffer: output,
        originalname: `${source.name}-${record.record_id}.webp`,
        mimetype: 'image/webp',
      },
      folder: source.folder,
      fallbackName: `${source.name}-${record.record_id}`,
    });
    migrated = { url: uploaded.url, size: output.length, originalSize: input.length };
    migratedUrls.set(oldUrl, migrated);
    await wait(350);
  }

  const metadataSql = source.metadata
    ? `, mime_type = 'image/webp', file_size = $4`
    : '';
  const values = source.metadata
    ? [migrated.url, record.record_id, oldUrl, migrated.size]
    : [migrated.url, record.record_id, oldUrl];
  const updated = await db.query(
    `UPDATE ${source.table}
     SET ${source.column} = $1${metadataSql}
     WHERE ${source.id} = $2 AND ${source.column} = $3
     RETURNING ${source.id}`,
    values
  );
  if (!updated.rowCount) throw new Error('record changed during migration');

  if (source.table === 'media_file') {
    await db.query(
      `UPDATE media_file
       SET file_name = REGEXP_REPLACE(file_name, '\\.[^.]+$', '.webp'), updated_at = CURRENT_TIMESTAMP
       WHERE media_id = $1`,
      [record.record_id]
    );
    await db.query(
      `UPDATE blog SET content = REPLACE(content, $1, $2) WHERE content LIKE '%' || $1 || '%'`,
      [oldUrl, migrated.url]
    );
  }

  return migrated;
}

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object Storage is not configured');

  const migratedUrls = new Map();
  let converted = 0;
  let skipped = 0;
  let failed = 0;
  let originalBytes = 0;
  let webpBytes = 0;

  for (const source of sources) {
    const result = await db.query(
      `SELECT ${source.id} AS record_id, ${source.column} AS url
       FROM ${source.table}
       WHERE ${source.where} AND NULLIF(BTRIM(${source.column}), '') IS NOT NULL
       ORDER BY ${source.id}`
    );

    for (const record of result.rows) {
      if (!isAbsoluteHttpUrl(record.url) || isCloudflyWebp(record.url)) {
        skipped += 1;
        continue;
      }
      try {
        const wasCached = migratedUrls.has(record.url);
        const migrated = await migrateRecord(source, record, migratedUrls);
        if (!wasCached) {
          originalBytes += migrated.originalSize;
          webpBytes += migrated.size;
        }
        converted += 1;
        console.log(`[${source.name}] ${record.record_id}: migrated${wasCached ? ' (reused object)' : ''}`);
      } catch (error) {
        failed += 1;
        console.error(`[${source.name}] ${record.record_id}: ${error.message}`);
      }
    }
  }

  const reduction = originalBytes
    ? Math.round((1 - webpBytes / originalBytes) * 1000) / 10
    : 0;
  console.log(JSON.stringify({ converted, uniqueObjects: migratedUrls.size, skipped, failed, originalBytes, webpBytes, reductionPercent: reduction }));
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
