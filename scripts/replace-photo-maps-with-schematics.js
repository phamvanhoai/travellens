require('dotenv').config();

const crypto = require('crypto');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const WIDTH = 1600;
const HEIGHT = 1000;

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'destination';
}

function wrapLabel(value, maxLength = 26) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function projectLocations(locations) {
  const points = locations.map((location) => ({
    ...location,
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  }));
  const valid = points.filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude));
  if (!valid.length) {
    return points.map((point, index) => ({ ...point, x: 800 + (index - (points.length - 1) / 2) * 260, y: 510 }));
  }

  const minLat = Math.min(...valid.map((point) => point.latitude));
  const maxLat = Math.max(...valid.map((point) => point.latitude));
  const minLng = Math.min(...valid.map((point) => point.longitude));
  const maxLng = Math.max(...valid.map((point) => point.longitude));
  const latSpan = Math.max(maxLat - minLat, 0.0003);
  const lngSpan = Math.max(maxLng - minLng, 0.0003);

  return points.map((point, index) => {
    if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) {
      return { ...point, x: 800 + index * 120, y: 520 };
    }
    return {
      ...point,
      x: 300 + ((point.longitude - minLng) / lngSpan) * 1000,
      y: 740 - ((point.latitude - minLat) / latSpan) * 430,
    };
  });
}

function createSvg(destination) {
  const points = projectLocations(destination.locations);
  const path = points.length > 1
    ? `<path d="M ${points.map((point) => `${point.x} ${point.y}`).join(' L ')}" fill="none" stroke="#f59e0b" stroke-width="18" stroke-linecap="round" stroke-dasharray="28 18" opacity="0.9"/>`
    : `<path d="M 230 760 C 460 670 560 570 800 520 C 1030 470 1160 360 1370 300" fill="none" stroke="#f59e0b" stroke-width="18" stroke-linecap="round" stroke-dasharray="28 18" opacity="0.9"/>`;
  const markers = points.map((point, index) => {
    const lines = wrapLabel(point.name);
    const labels = lines.map((line, lineIndex) => `<tspan x="${point.x}" dy="${lineIndex ? 28 : 0}">${escapeXml(line)}</tspan>`).join('');
    return `<g>
      <circle cx="${point.x}" cy="${point.y}" r="42" fill="#ffffff" stroke="#0f766e" stroke-width="8"/>
      <circle cx="${point.x}" cy="${point.y}" r="25" fill="#14b8a6"/>
      <text x="${point.x}" y="${point.y + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${index + 1}</text>
      <rect x="${point.x - 170}" y="${point.y + 56}" width="340" height="${lines.length > 1 ? 82 : 58}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <text x="${point.x}" y="${point.y + 93}" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="#0f172a">${labels}</text>
    </g>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecfdf5"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#94a3b8" stroke-width="2" opacity="0.16"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.14"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#background)"/>
  <rect width="1600" height="1000" fill="url(#grid)"/>
  <path d="M0 680 C220 590 330 760 520 670 C720 575 870 710 1060 620 C1240 535 1430 600 1600 520 V1000 H0Z" fill="#bbf7d0" opacity="0.62"/>
  <path d="M0 820 C260 720 400 850 650 790 C900 730 1130 850 1600 700" fill="none" stroke="#7dd3fc" stroke-width="80" opacity="0.55"/>
  <rect x="52" y="45" width="1496" height="150" rx="34" fill="#ffffff" opacity="0.96" filter="url(#shadow)"/>
  <text x="100" y="108" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#0f766e">SƠ ĐỒ THAM QUAN</text>
  <text x="100" y="163" font-family="Arial, sans-serif" font-size="45" font-weight="800" fill="#0f172a">${escapeXml(destination.destination_name)}</text>
  <g transform="translate(1425 76)"><path d="M30 0 L58 70 L30 55 L2 70 Z" fill="#ef4444"/><text x="30" y="98" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#334155">BẮC</text></g>
  ${path}
  <g filter="url(#shadow)">${markers}</g>
  <rect x="52" y="884" width="1496" height="72" rx="24" fill="#ffffff" opacity="0.94"/>
  <circle cx="96" cy="920" r="17" fill="#14b8a6"/><text x="128" y="929" font-family="Arial" font-size="25" fill="#334155">Điểm tham quan</text>
  <line x1="355" y1="920" x2="435" y2="920" stroke="#f59e0b" stroke-width="12" stroke-dasharray="18 12"/><text x="458" y="929" font-family="Arial" font-size="25" fill="#334155">Tuyến gợi ý</text>
  <text x="1495" y="929" text-anchor="end" font-family="Arial" font-size="22" fill="#64748b">Tọa độ WGS84 • TravelLens</text>
</svg>`;
}

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object storage is not configured');
  const client = await db.getClient();
  const uploaded = [];
  try {
    const result = await client.query(
      `SELECT d.destination_id, d.name AS destination_name,
              l.location_id, l.name, l.latitude, l.longitude,
              m.map_id
       FROM map m
       JOIN location l ON l.location_id = m.location_id
       JOIN travel_destination d ON d.destination_id = l.destination_id
       WHERE m.deleted_at IS NULL
       ORDER BY d.destination_id, l.location_id, m.map_id`
    );
    const groups = new Map();
    for (const row of result.rows) {
      if (!groups.has(row.destination_id)) {
        groups.set(row.destination_id, { destination_id: row.destination_id, destination_name: row.destination_name, locations: [], mapIds: [] });
      }
      const group = groups.get(row.destination_id);
      if (!group.locations.some((location) => location.location_id === row.location_id)) group.locations.push(row);
      group.mapIds.push(row.map_id);
    }

    for (const destination of groups.values()) {
      const svg = createSvg(destination);
      const buffer = Buffer.from(svg, 'utf8');
      const fileName = `so-do-${slugify(destination.destination_name)}-${destination.destination_id}.svg`;
      const upload = await objectStorage.uploadFile({
        file: { buffer, originalname: fileName, mimetype: 'image/svg+xml' },
        folder: 'maps',
        fallbackName: `destination-${destination.destination_id}-map`,
      });
      uploaded.push({ ...destination, url: upload.url, sha256: crypto.createHash('sha256').update(buffer).digest('hex'), bytes: buffer.length });
    }

    await client.query('BEGIN');
    try {
      for (const destination of uploaded) {
        await client.query(
          `UPDATE map m
           SET map_file = $1,
               title = 'Sơ đồ ' || l.name,
               description = $2,
               updated_at = CURRENT_TIMESTAMP
           FROM location l
           WHERE m.location_id = l.location_id
             AND m.map_id = ANY($3::int[])`,
          [destination.url, `Sơ đồ tham quan ${destination.destination_name}, hiển thị các điểm và tuyến tham quan gợi ý.`, destination.mapIds]
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    console.log(JSON.stringify({ success: true, destinations: uploaded.length, maps: uploaded.reduce((sum, item) => sum + item.mapIds.length, 0), uploaded: uploaded.map(({ destination_id, destination_name, url, bytes, sha256, mapIds }) => ({ destination_id, destination_name, url, bytes, sha256, maps: mapIds.length })) }, null, 2));
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
