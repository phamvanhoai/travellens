require('dotenv').config();

const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const VOICE = 'vi-VN-HoaiMyNeural';
const tempDir = path.join(os.tmpdir(), 'travellens-view360-narrations');

function plainText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function narrationFor(row) {
  const locationDescription = plainText(row.location_description).slice(0, 360);
  const destinationDescription = plainText(row.destination_description).slice(0, 260);
  return [
    `Chào mừng bạn đến với ${row.location_name}, một điểm tham quan thuộc ${row.destination_name}.`,
    locationDescription || `${row.location_name} là một vị trí nổi bật trong hành trình khám phá ${row.destination_name}.`,
    destinationDescription,
    'Bạn có thể xoay góc nhìn để quan sát toàn bộ không gian. Hãy giữ gìn cảnh quan và tuân thủ các hướng dẫn tại điểm tham quan. Chúc bạn có một trải nghiệm thật thú vị cùng TravelLens.',
  ].filter(Boolean).join(' ');
}

function synthesize(text, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('python', [
      '-m', 'edge_tts', '--voice', VOICE, '--rate=-5%', '--text', text,
      '--write-media', outputPath,
    ], { windowsHide: true });
    let errorOutput = '';
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(errorOutput || `edge-tts exited with code ${code}`)));
  });
}

async function processWithConcurrency(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object storage must be configured to publish narration audio');
  await fs.mkdir(tempDir, { recursive: true });
  const result = await db.query(
    `SELECT v.view_id, v.title, l.name AS location_name, l.description AS location_description,
            d.name AS destination_name, d.description AS destination_description
     FROM view360 v
     JOIN location l ON l.location_id=v.location_id
     JOIN travel_destination d ON d.destination_id=l.destination_id
     WHERE v.deleted_at IS NULL AND NULLIF(BTRIM(v.audio_file),'') IS NULL
     ORDER BY v.view_id`
  );

  const generated = [];
  try {
    await processWithConcurrency(result.rows, 3, async (row, index) => {
      const outputPath = path.join(tempDir, `view360-${row.view_id}.mp3`);
      await synthesize(narrationFor(row), outputPath);
      const buffer = await fs.readFile(outputPath);
      if (buffer.length < 1000) throw new Error(`Generated audio is unexpectedly small for View360 ${row.view_id}`);
      const upload = await objectStorage.uploadFile({
        file: { buffer, originalname: `thuyet-minh-view360-${row.view_id}.mp3`, mimetype: 'audio/mpeg' },
        folder: 'view360-audio',
        fallbackName: `view360-${row.view_id}`,
      });
      generated.push({ viewId: row.view_id, url: upload.url, bytes: buffer.length });
      await fs.unlink(outputPath).catch(() => {});
      console.log(`[${index + 1}/${result.rows.length}] ${row.location_name}`);
    });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      for (const item of generated) {
        await client.query(
          `UPDATE view360 SET audio_file=$1, updated_at=CURRENT_TIMESTAMP
           WHERE view_id=$2 AND NULLIF(BTRIM(audio_file),'') IS NULL`,
          [item.url, item.viewId]
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    console.log(JSON.stringify({ success: true, voice: VOICE, generated: generated.length, total_bytes: generated.reduce((sum, item) => sum + item.bytes, 0) }, null, 2));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    await db.pool.end();
  }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
