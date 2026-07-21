require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const db = require('../src/config/db');
const objectStorage = require('../src/services/objectStorage.service');

const specs = [
  {
    destinationName: 'Làng du lịch sinh thái Ông Đề',
    locationName: 'Khu trò chơi dân gian Ông Đề',
    description: 'Không gian trò chơi dân gian giữa cảnh quan miệt vườn, với cầu gỗ, chòi lá và các hoạt động tập thể đặc trưng miền Tây.',
    title: 'Toàn cảnh khu trò chơi dân gian Ông Đề',
    localFile: path.resolve(__dirname, '..', '..', 'travellens-fe', 'public', 'view360-generated', 'ong-de-folk-games-360.png'),
    latitude: 9.9907,
    longitude: 105.7091,
  },
  {
    destinationName: 'Dinh Độc Lập – Không gian trưng bày',
    locationName: 'Phòng khánh tiết Dinh Độc Lập',
    description: 'Không gian tiếp đón trang trọng bên trong Dinh Độc Lập, thể hiện phong cách kiến trúc và nội thất tiêu biểu của công trình.',
    title: 'Toàn cảnh phòng khánh tiết Dinh Độc Lập',
    localFile: path.resolve(__dirname, '..', '..', 'travellens-fe', 'public', 'view360-generated', 'dinh-doc-lap-reception-hall-360.png'),
    latitude: 10.7772,
    longitude: 106.6955,
  },
];

async function run() {
  if (!objectStorage.isEnabled) throw new Error('Object storage is not configured');
  const client = await db.getClient();
  const inserted = [];
  try {
    for (const spec of specs) {
      const destination = (await client.query(`SELECT destination_id FROM travel_destination WHERE name=$1 AND deleted_at IS NULL`, [spec.destinationName])).rows[0];
      if (!destination) throw new Error(`Destination not found: ${spec.destinationName}`);
      const existing = (await client.query(`SELECT v.view_id FROM view360 v JOIN location l ON l.location_id=v.location_id WHERE l.destination_id=$1 AND v.deleted_at IS NULL LIMIT 1`, [destination.destination_id])).rows[0];
      if (existing) {
        inserted.push({ destination: spec.destinationName, skipped: true, view_id: existing.view_id });
        continue;
      }

      const buffer = await fs.readFile(spec.localFile);
      const upload = await objectStorage.uploadFile({
        file: { buffer, originalname: path.basename(spec.localFile), mimetype: 'image/png' },
        folder: 'view360-images',
        fallbackName: 'destination-panorama',
      });

      await client.query('BEGIN');
      try {
        const location = (await client.query(
          `INSERT INTO location(name,description,thumbnail,destination_id,latitude,longitude,is_deleted)
           VALUES($1,$2,$3,$4,$5,$6,false) RETURNING location_id`,
          [spec.locationName, spec.description, upload.url, destination.destination_id, spec.latitude, spec.longitude]
        )).rows[0];
        const view = (await client.query(
          `INSERT INTO view360(location_id,title,description,language,order_index)
           VALUES($1,$2,$3,'Vietnamese',1) RETURNING view_id`,
          [location.location_id, spec.title, spec.description]
        )).rows[0];
        await client.query(`INSERT INTO view360_image(view_id,image_file,order_index) VALUES($1,$2,1)`, [view.view_id, upload.url]);
        await client.query(
          `INSERT INTO map(location_id,title,map_file,description,display_order)
           VALUES($1,$2,$3,$4,1)`,
          [location.location_id, `Bản đồ ${spec.locationName}`, upload.url, `Vị trí tham quan ${spec.locationName}.`]
        );
        await client.query('COMMIT');
        inserted.push({ destination: spec.destinationName, location_id: location.location_id, view_id: view.view_id, image_url: upload.url });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    console.log(JSON.stringify({ success: true, results: inserted }, null, 2));
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
