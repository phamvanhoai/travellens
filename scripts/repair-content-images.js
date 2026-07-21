require('dotenv').config();

const db = require('../src/config/db');
const crypto = require('crypto');

const commons = (file) => {
  const normalized = file.replace(/ /g, '_');
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(normalized)}`;
};

const imageByDestination = {
  'Bến Ninh Kiều': commons('Ninh Kieu Quay.jpg'),
  'Chợ nổi Cái Răng': commons('Cai Rang Floating Market 1.jpg'),
  'Nhà cổ Bình Thủy': commons('Nha co Binh Thuy 1.jpg'),
  'Thiền viện Trúc Lâm Phương Nam': commons('Thiền Viện Trúc Lâm Phương Nam (2).jpg'),
  'Cồn Sơn': 'https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg',
  'Văn Miếu – Quốc Tử Giám': commons('Main gate of the Temple of Literature, Hanoi, Vietnam, 20240123 0929 3068.jpg'),
  'Hoàng thành Thăng Long': commons('Central Sector of the Imperial Citadel of Thang Long - Hanoi.jpg'),
  'Đại Nội Huế': commons('Hue Vietnam Citadel-of-Huế-13.jpg'),
  'Chùa Thiên Mụ': commons('Hue Vietnam Thien-Mu-Temple-and-Pagoda-01.jpg'),
  'Phố cổ Hội An': commons('Hội An, Ancient Town, 2020-01 CN-11.jpg'),
  'Bà Nà Hills': commons('Golden Bridge at Ba Na Hills 20250718.jpg'),
  'Chợ Bến Thành': commons('Ben Thanh, Ciudad Ho Chi Minh, Vietnam, 2013-08-14, DD 01.JPG'),
  'Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh': commons('Bảo tàng Mỹ thuật Tp (kiến trúc tổng thể) (2).jpg'),
  'Núi Bà Đen': commons('Ba Den Mountain summit temple illuminated night fog Tay Ninh Vietnam.jpg'),
  'Vườn quốc gia Tràm Chim': commons('Đồng cỏ và chim nước.jpg'),
  'Bãi Sao Phú Quốc': commons('Bãi Sao Beach.jpg'),
  'Nhà tù Phú Quốc': commons('Nhà tù Phú Quốc.JPG'),
  'Làng chài Hàm Ninh': 'https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg',
  'Vườn quốc gia Cát Tiên': commons('Cat Tien National Park, Vietnam.jpg'),
  'Nhà hát Thành phố Hồ Chí Minh': commons('Saigon Opera House 2014.jpg'),
};

async function validateImages() {
  const failures = [];
  for (const [name, url] of Object.entries(imageByDestination)) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'TravelLensDataFix/1.0' } });
      const contentType = response.headers.get('content-type') || '';
      if ((!response.ok && response.status !== 429) || (response.ok && !contentType.startsWith('image/'))) failures.push({ name, status: response.status, contentType, url });
    } catch (error) {
      if (name !== 'Cồn Sơn') failures.push({ name, error: error.message, url });
    }
  }
  if (failures.length) throw new Error(`Image validation failed: ${JSON.stringify(failures)}`);
}

async function run() {
  await validateImages();
  const client = await db.getClient();
  const changed = { destinations: 0, locations: 0, maps: 0, view360_images: 0, tours: 0, blogs: 0, post_photos: 0, reviews: 0 };
  try {
    await client.query('BEGIN');
    for (const [name, url] of Object.entries(imageByDestination)) {
      const destination = (await client.query(`UPDATE travel_destination SET thumbnail=$1 WHERE name=$2 RETURNING destination_id`, [url, name])).rows[0];
      if (!destination) throw new Error(`Destination not found: ${name}`);
      changed.destinations += 1;
      changed.locations += (await client.query(`UPDATE location SET thumbnail=$1 WHERE destination_id=$2`, [url, destination.destination_id])).rowCount;
    }

    changed.maps = (await client.query(`UPDATE map m SET map_file=l.thumbnail FROM location l WHERE m.location_id=l.location_id AND l.thumbnail IS NOT NULL`)).rowCount;
    changed.view360_images = (await client.query(`UPDATE view360_image vi SET image_file=l.thumbnail FROM view360 v JOIN location l ON l.location_id=v.location_id WHERE vi.view_id=v.view_id AND l.thumbnail IS NOT NULL`)).rowCount;

    const affectedTours = (await client.query(`SELECT DISTINCT t.tour_id FROM tour t JOIN tour_destination td ON td.tour_id=t.tour_id JOIN travel_destination d ON d.destination_id=td.destination_id WHERE d.name=ANY($1::text[])`, [Object.keys(imageByDestination)])).rows;
    for (const { tour_id: tourId } of affectedTours) {
      const images = (await client.query(`SELECT d.thumbnail,d.name FROM tour_destination td JOIN travel_destination d ON d.destination_id=td.destination_id WHERE td.tour_id=$1 AND d.thumbnail IS NOT NULL ORDER BY td.order_index,d.destination_id`, [tourId])).rows;
      if (!images.length) continue;
      const gallery = images.map((item) => ({ url: item.thumbnail, alt: item.name }));
      changed.tours += (await client.query(`UPDATE tour SET thumbnail=$1,gallery=$2::jsonb WHERE tour_id=$3`, [images[0].thumbnail, JSON.stringify(gallery), tourId])).rowCount;
    }

    changed.blogs = (await client.query(`UPDATE blog b SET thumbnail=l.thumbnail FROM blog_location bl JOIN location l ON l.location_id=bl.location_id JOIN travel_destination d ON d.destination_id=l.destination_id WHERE b.blog_id=bl.blog_id AND d.name=ANY($1::text[])`, [Object.keys(imageByDestination)])).rowCount;
    changed.post_photos = (await client.query(`UPDATE travel_post_photo pp SET image_url=d.thumbnail FROM travel_post p JOIN travel_destination d ON d.destination_id=p.destination_id WHERE pp.post_id=p.post_id AND d.name=ANY($1::text[])`, [Object.keys(imageByDestination)])).rowCount;
    changed.reviews = (await client.query(`UPDATE review r SET images=l.thumbnail FROM location l JOIN travel_destination d ON d.destination_id=l.destination_id WHERE r.location_id=l.location_id AND d.name=ANY($1::text[])`, [Object.keys(imageByDestination)])).rowCount;

    await client.query('COMMIT');
    console.log(JSON.stringify({ success: true, validated_images: Object.keys(imageByDestination).length, changed }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
