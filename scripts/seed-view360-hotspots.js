require('dotenv').config();

const db = require('../src/config/db');

const APP_URL = (process.env.FRONTEND_URL || 'https://travellens-fe.vercel.app').replace(/\/$/, '');

async function insertIfMissing(client, hotspot) {
  const result = await client.query(
    `INSERT INTO view360_hotspot
       (view360_id, type, title, description, yaw, pitch, target_view360_id,
        target_url, order_index, is_active)
     SELECT $1, $2::varchar, $3::varchar, $4::text, $5, $6, $7, $8::text, $9, TRUE
     WHERE NOT EXISTS (
       SELECT 1
       FROM view360_hotspot
       WHERE view360_id = $1
         AND type = $2::varchar
         AND deleted_at IS NULL
         AND (($2::varchar = 'navigation' AND target_view360_id = $7) OR title = $3::varchar)
     )`,
    [
      hotspot.viewId,
      hotspot.type,
      hotspot.title,
      hotspot.description,
      hotspot.yaw,
      hotspot.pitch,
      hotspot.targetViewId,
      hotspot.targetUrl,
      hotspot.orderIndex,
    ]
  );
  return result.rowCount;
}

async function main() {
  const client = await db.getClient();
  const inserted = { navigation: 0, info: 0, location: 0, link: 0 };
  const destinationsWithoutNavigation = [];

  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT d.destination_id,
              d.name AS destination_name,
              l.location_id,
              l.name AS location_name,
              l.latitude,
              l.longitude,
              v.view_id,
              v.title,
              v.description,
              v.order_index
       FROM travel_destination d
       JOIN location l
         ON l.destination_id = d.destination_id
        AND l.deleted_at IS NULL
        AND COALESCE(l.is_deleted, FALSE) = FALSE
       JOIN view360 v
         ON v.location_id = l.location_id
        AND v.deleted_at IS NULL
       WHERE d.deleted_at IS NULL
       ORDER BY d.destination_id, v.order_index ASC NULLS LAST, v.view_id ASC`
    );

    const grouped = new Map();
    for (const scene of result.rows) {
      const scenes = grouped.get(scene.destination_id) || [];
      scenes.push(scene);
      grouped.set(scene.destination_id, scenes);
    }

    for (const scenes of grouped.values()) {
      const first = scenes[0];
      if (scenes.length < 2) destinationsWithoutNavigation.push(first.destination_name);

      for (let index = 0; index < scenes.length; index += 1) {
        const scene = scenes[index];
        const target = scenes.length > 1 ? scenes[(index + 1) % scenes.length] : null;
        const description = (scene.description || '').trim()
          || `${scene.location_name} là một điểm tham quan thuộc ${scene.destination_name}.`;

        if (target) {
          inserted.navigation += await insertIfMissing(client, {
            viewId: scene.view_id,
            type: 'navigation',
            title: `Đi đến ${target.location_name}`,
            description: `Chuyển sang không gian 360 tại ${target.location_name}, cùng điểm đến ${scene.destination_name}.`,
            yaw: (35 + index * 83) % 360,
            pitch: -4,
            targetViewId: target.view_id,
            targetUrl: null,
            orderIndex: 10,
          });
        }

        inserted.info += await insertIfMissing(client, {
          viewId: scene.view_id,
          type: 'info',
          title: `Giới thiệu ${scene.location_name}`,
          description,
          yaw: (145 + index * 71) % 360,
          pitch: 8,
          targetViewId: null,
          targetUrl: null,
          orderIndex: 20,
        });

        const coordinates = scene.latitude != null && scene.longitude != null
          ? `Tọa độ ${Number(scene.latitude).toFixed(6)}, ${Number(scene.longitude).toFixed(6)}.`
          : `Vị trí tham quan thuộc ${scene.destination_name}.`;
        inserted.location += await insertIfMissing(client, {
          viewId: scene.view_id,
          type: 'location',
          title: `Vị trí ${scene.location_name}`,
          description: `${coordinates} Không gian này thuộc ${scene.destination_name}.`,
          yaw: (255 + index * 59) % 360,
          pitch: -12,
          targetViewId: null,
          targetUrl: null,
          orderIndex: 30,
        });
      }

      inserted.link += await insertIfMissing(client, {
        viewId: first.view_id,
        type: 'link',
        title: `Khám phá ${first.destination_name}`,
        description: `Xem thông tin, hình ảnh và nội dung liên quan đến ${first.destination_name}.`,
        yaw: 320,
        pitch: 5,
        targetViewId: null,
        targetUrl: `${APP_URL}/destinations/${first.destination_id}`,
        orderIndex: 40,
      });
    }

    await client.query('COMMIT');
    console.log(JSON.stringify({ inserted, destinationsWithoutNavigation }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
