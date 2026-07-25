require('dotenv').config();

const db = require('../src/config/db');

const photos = [
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
];

const categoryData = {
  destination_category: [
    ['Lịch sử', 'Di tích và công trình gắn với những dấu mốc quan trọng của Việt Nam.'],
    ['Sinh thái', 'Điểm đến gần gũi thiên nhiên và hệ sinh thái bản địa.'],
    ['Văn hóa', 'Không gian lưu giữ phong tục, di sản và đời sống cộng đồng.'],
    ['Tâm linh', 'Chùa, thiền viện và công trình tín ngưỡng có giá trị kiến trúc.'],
    ['Giải trí', 'Tổ hợp vui chơi, công viên và trải nghiệm dành cho mọi lứa tuổi.'],
    ['Ẩm thực', 'Chợ, phố ăn uống và không gian trải nghiệm đặc sản địa phương.'],
    ['Kiến trúc', 'Công trình nổi bật về phong cách thiết kế và giá trị thẩm mỹ.'],
    ['Mua sắm', 'Chợ truyền thống, phố thương mại và điểm mua sắm đặc trưng.'],
    ['Biển đảo', 'Bãi biển, đảo và cảnh quan ven biển nổi bật.'],
    ['Nghệ thuật', 'Bảo tàng, phòng trưng bày và không gian sáng tạo.'],
  ],
  tour_category: [
    ['Gia đình', 'Lịch trình nhẹ nhàng, phù hợp gia đình và trẻ em.'],
    ['Cặp đôi', 'Hành trình riêng tư và lãng mạn dành cho hai người.'],
    ['Khám phá', 'Hành trình đa trải nghiệm, tìm hiểu điểm đến theo cách bản địa.'],
    ['Văn hóa – Lịch sử', 'Tour tìm hiểu di sản, kiến trúc và các câu chuyện lịch sử.'],
    ['Ẩm thực', 'Khám phá món ngon, chợ địa phương và văn hóa bàn ăn.'],
    ['Sinh thái', 'Trải nghiệm thiên nhiên, miệt vườn và du lịch có trách nhiệm.'],
    ['Nghỉ dưỡng', 'Lịch trình thư giãn với dịch vụ lưu trú và chăm sóc chất lượng.'],
    ['Phiêu lưu', 'Hoạt động ngoài trời dành cho du khách yêu vận động.'],
    ['Cao cấp', 'Hành trình riêng với dịch vụ và phương tiện tiêu chuẩn cao.'],
    ['Trong ngày', 'Tour ngắn gọn, tối ưu cho quỹ thời gian một ngày.'],
  ],
  blog_category: [
    ['Khuyến mãi', 'Ưu đãi, chương trình giảm giá và kinh nghiệm săn deal.'],
    ['Tin tức', 'Tin tức và cập nhật mới về du lịch.'],
    ['Cẩm nang', 'Hướng dẫn chuẩn bị và kinh nghiệm thực tế cho chuyến đi.'],
    ['Điểm đến', 'Thông tin chi tiết và gợi ý khám phá từng điểm đến.'],
    ['Ẩm thực', 'Món ngon, địa chỉ ăn uống và câu chuyện ẩm thực.'],
    ['Văn hóa', 'Phong tục, di sản và đời sống cộng đồng địa phương.'],
    ['Lịch trình', 'Lịch trình mẫu theo ngày và theo chủ đề.'],
    ['Mẹo du lịch', 'Mẹo đặt dịch vụ, di chuyển và quản lý chi phí.'],
    ['Trải nghiệm', 'Câu chuyện và cảm nhận chân thực từ hành trình.'],
  ],
};

const destinationData = [
  ['Văn Miếu – Quốc Tử Giám', 'Văn hóa', 21.0285, 105.8355, ['Khuê Văn Các', 'Nhà Thái Học']],
  ['Hoàng thành Thăng Long', 'Lịch sử', 21.0352, 105.8403, ['Đoan Môn', 'Khu khảo cổ 18 Hoàng Diệu']],
  ['Đại Nội Huế', 'Lịch sử', 16.4695, 107.5780, ['Ngọ Môn', 'Điện Thái Hòa']],
  ['Chùa Thiên Mụ', 'Tâm linh', 16.4532, 107.5449, ['Tháp Phước Duyên', 'Điện Đại Hùng']],
  ['Phố cổ Hội An', 'Văn hóa', 15.8801, 108.3380, ['Chùa Cầu', 'Hội quán Phúc Kiến']],
  ['Bà Nà Hills', 'Giải trí', 15.9977, 107.9881, ['Cầu Vàng', 'Làng Pháp']],
  ['Chợ Bến Thành', 'Mua sắm', 10.7725, 106.6980, ['Cửa Nam', 'Khu ẩm thực']],
  ['Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh', 'Nghệ thuật', 10.7699, 106.6999, ['Tòa nhà chính', 'Khu trưng bày nghệ thuật hiện đại']],
  ['Núi Bà Đen', 'Tâm linh', 11.3709, 106.1718, ['Chùa Bà', 'Đỉnh Vân Sơn']],
  ['Vườn quốc gia Tràm Chim', 'Sinh thái', 10.7253, 105.5165, ['Trạm quan sát chim', 'Tuyến xuồng xuyên rừng']],
  ['Bãi Sao Phú Quốc', 'Biển đảo', 10.0580, 104.0368, ['Bãi tắm trung tâm', 'Khu chèo kayak']],
  ['Nhà tù Phú Quốc', 'Lịch sử', 10.0453, 104.0172, ['Nhà trưng bày', 'Khu tái hiện lịch sử']],
  ['Làng chài Hàm Ninh', 'Ẩm thực', 10.1768, 104.0498, ['Cầu cảng Hàm Ninh', 'Khu hải sản']],
  ['Vườn quốc gia Cát Tiên', 'Sinh thái', 11.4235, 107.4281, ['Bàu Sấu', 'Tuyến cây cổ thụ']],
  ['Nhà hát Thành phố Hồ Chí Minh', 'Kiến trúc', 10.7765, 106.7030, ['Sảnh chính', 'Khán phòng']],
];

const tourData = [
  ['Tinh Hoa Hà Nội Một Ngày', 'tinh-hoa-ha-noi-mot-ngay', 'Văn hóa – Lịch sử', 1290000, 850000, 1, 0, [0,1]],
  ['Hoàng Thành và Văn Miếu', 'hoang-thanh-va-van-mieu', 'Trong ngày', 790000, 520000, 1, 0, [0,1]],
  ['Di Sản Cố Đô Huế', 'di-san-co-do-hue', 'Văn hóa – Lịch sử', 1490000, 950000, 1, 0, [2,3]],
  ['Huế An Nhiên Ba Ngày', 'hue-an-nhien-ba-ngay', 'Nghỉ dưỡng', 4690000, 3190000, 3, 2, [2,3]],
  ['Hội An Đêm Phố Cổ', 'hoi-an-dem-pho-co', 'Cặp đôi', 990000, 650000, 1, 0, [4]],
  ['Đà Nẵng Bà Nà và Hội An', 'da-nang-ba-na-hoi-an', 'Gia đình', 3590000, 2390000, 3, 2, [4,5]],
  ['Sài Gòn Kiến Trúc và Nghệ Thuật', 'sai-gon-kien-truc-nghe-thuat', 'Văn hóa – Lịch sử', 890000, 590000, 1, 0, [7,14]],
  ['Sài Gòn Food Tour Buổi Tối', 'sai-gon-food-tour-buoi-toi', 'Ẩm thực', 850000, 590000, 1, 0, [6]],
  ['Chinh Phục Núi Bà Đen', 'chinh-phuc-nui-ba-den', 'Phiêu lưu', 1590000, 1090000, 2, 1, [8]],
  ['Tràm Chim Mùa Nước Nổi', 'tram-chim-mua-nuoc-noi', 'Sinh thái', 1890000, 1250000, 2, 1, [9]],
  ['Phú Quốc Biển Xanh Bốn Ngày', 'phu-quoc-bien-xanh-bon-ngay', 'Nghỉ dưỡng', 7290000, 4890000, 4, 3, [10,11,12]],
  ['Hàm Ninh và Bãi Sao Riêng Tư', 'ham-ninh-bai-sao-rieng-tu', 'Cao cấp', 3290000, 2190000, 1, 0, [10,12]],
  ['Cát Tiên Khám Phá Rừng Xanh', 'cat-tien-kham-pha-rung-xanh', 'Phiêu lưu', 2890000, 1890000, 3, 2, [13]],
  ['Hành Trình Di Sản Việt Nam 8 Ngày', 'hanh-trinh-di-san-viet-nam-8-ngay', 'Khám phá', 18990000, 12990000, 8, 7, [0,1,2,3,4,5]],
  ['Việt Nam Cao Cấp 10 Ngày', 'viet-nam-cao-cap-10-ngay', 'Cao cấp', 38900000, 26900000, 10, 9, [0,2,4,7,10]],
];

async function one(client, sql, params = []) {
  sql = sql.replace('($7+2)', '($7::int+2)');
  // Blog inserts receive the generated slug between content and thumbnail.
  if (sql.includes('INSERT INTO blog(') && params.length === 5) {
    const slug = params[1].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    params = [params[0], params[1], params[2], slug, params[3], params[4]];
  }
  return (await client.query(sql, params)).rows[0];
}

async function ensureCategories(client, table, idColumn, records) {
  const result = {};
  for (const [name, description] of records) {
    let row = await one(client, `SELECT ${idColumn} id FROM ${table} WHERE lower(name)=lower($1) LIMIT 1`, [name]);
    if (row) await client.query(`UPDATE ${table} SET name=$1,description=$2 WHERE ${idColumn}=$3`, [name, description, row.id]);
    else row = await one(client, `INSERT INTO ${table}(name,description) VALUES($1,$2) RETURNING ${idColumn} id`, [name, description]);
    result[name.toLocaleLowerCase('vi')] = row.id;
  }
  return result;
}

async function run() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    if (await one(client, `SELECT tour_id FROM tour WHERE slug='hanh-trinh-di-san-viet-nam-8-ngay'`)) {
      await client.query('ROLLBACK');
      console.log(JSON.stringify({success:true,skipped:true,message:'Production-scale content already exists'},null,2));
      return;
    }

    const destinationCategories = await ensureCategories(client,'destination_category','destination_category_id',categoryData.destination_category);
    const tourCategories = await ensureCategories(client,'tour_category','tour_category_id',categoryData.tour_category);
    const blogCategories = await ensureCategories(client,'blog_category','blog_category_id',categoryData.blog_category);
    const users=(await client.query(`SELECT user_id,name,role,phone FROM users WHERE status='active' ORDER BY user_id`)).rows;
    const customers=users.filter(x=>x.role==='customer'); const staff=users.find(x=>x.role==='staff')||users.find(x=>x.role==='admin');
    if(customers.length<5||!staff) throw new Error('Not enough existing active users');

    const destinations=[]; const locations=[];
    for(let i=0;i<destinationData.length;i++){
      const [name,category,lat,lng,locationNames]=destinationData[i];
      const d=await one(client,`INSERT INTO travel_destination(name,description,thumbnail,destination_category_id,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6) RETURNING destination_id,name`,[name,`<p>${name} là điểm tham quan nổi bật, mang giá trị đặc trưng về ${category.toLocaleLowerCase('vi')} và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>`,photos[i%photos.length],destinationCategories[category.toLocaleLowerCase('vi')],lat,lng]);
      destinations.push(d);
      for(let j=0;j<locationNames.length;j++){
        const l=await one(client,`INSERT INTO location(name,description,thumbnail,destination_id,latitude,longitude,is_deleted) VALUES($1,$2,$3,$4,$5,$6,false) RETURNING location_id,name`,[locationNames[j],`${locationNames[j]} là một vị trí tham quan quan trọng thuộc ${name}, có biển hướng dẫn và không gian thuận tiện cho du khách.`,photos[(i+j)%photos.length],d.destination_id,lat+(j+1)*0.0002,lng+(j+1)*0.0002]);
        locations.push(l);
        await client.query(`INSERT INTO map(location_id,title,map_file,description,display_order) VALUES($1,$2,$3,$4,1)`,[l.location_id,`Bản đồ ${locationNames[j]}`,photos[(i+j)%photos.length],`Sơ đồ tham quan ${locationNames[j]} và các tiện ích xung quanh.`]);
        const v=await one(client,`INSERT INTO view360(location_id,title,description,language,order_index) VALUES($1,$2,$3,'vi',1) RETURNING view_id`,[l.location_id,`Toàn cảnh ${locationNames[j]}`,`Hình ảnh toàn cảnh tại ${locationNames[j]}.`]);
        await client.query(`INSERT INTO view360_image(view_id,image_file,order_index) VALUES($1,$2,1)`,[v.view_id,photos[(i+j)%photos.length]]);
      }
    }

    const content=[];
    for(const [type,text] of [['highlight','Hướng dẫn viên am hiểu văn hóa địa phương'],['highlight','Nhóm nhỏ, lịch trình linh hoạt'],['inclusion','Phương tiện di chuyển theo chương trình'],['inclusion','Vé tham quan tại các điểm trong lịch trình'],['inclusion','Nước uống mỗi ngày'],['exclusion','Chi phí cá nhân và đồ uống ngoài chương trình'],['requirement','Mang theo giấy tờ tùy thân'],['requirement','Chuẩn bị trang phục phù hợp thời tiết'],['cancellation_policy','Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ'],['booking_policy','Xác nhận đặt chỗ sau khi thanh toán thành công']]) content.push(await one(client,`INSERT INTO tour_content_item(type,content,status,normalized_content) VALUES($1,$2,'active',lower($2)) RETURNING content_item_id,type,content`,[type,text]));

    const tours=[];
    for(let i=0;i<tourData.length;i++){
      const [name,slug,category,price,childPrice,days,nights,destinationIndexes]=tourData[i];
      const t=await one(client,`INSERT INTO tour(name,slug,description,short_description,price,child_price,infant_price,currency,schedule,capacity,tour_category_id,status,thumbnail,start_at,duration_days,duration_nights,start_time,end_time,languages,difficulty,minimum_participants,minimum_booking,maximum_booking,meeting_point,pickup_available,highlights,inclusions,exclusions,requirements,cancellation_policy,booking_policy,faqs,gallery) VALUES($1,$2,$3,$4,$5,$6,0,'VND',$7,$8,$9,'active',$10,CURRENT_TIMESTAMP+(($11+14)||' days')::interval,$12,$13,'07:30','17:30','["Tiếng Việt","English"]'::jsonb,$14,1,1,$8,'Điểm đón trung tâm theo xác nhận',true,$15::jsonb,$16::jsonb,$17::jsonb,$18::jsonb,'Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ.','Đặt trước tối thiểu 24 giờ.',$19::jsonb,$20::jsonb) RETURNING tour_id,name`,[name,slug,`Hành trình ${name.toLowerCase('vi')} được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.`,`Khám phá điểm đến tiêu biểu trong ${days} ngày ${nights} đêm.`,price,childPrice,days===1?'07:30 – 17:30':`Lịch trình ${days} ngày`,18+(i%4)*4,tourCategories[category.toLocaleLowerCase('vi')],photos[i%photos.length],i,days,nights,category==='Phiêu lưu'?'moderate':'easy',JSON.stringify(['Điểm đến chọn lọc','Hướng dẫn viên chuyên nghiệp','Trải nghiệm bản địa']),JSON.stringify(['Xe đưa đón','Vé tham quan','Nước uống','Bảo hiểm du lịch']),JSON.stringify(['Chi phí cá nhân','Phụ thu phòng đơn']),JSON.stringify(['Giấy tờ tùy thân','Giày đi bộ thoải mái']),JSON.stringify([{question:'Có hỗ trợ trẻ em không?',answer:'Có, vui lòng cung cấp độ tuổi khi đặt tour.'},{question:'Có đón tại khách sạn không?',answer:'Có tại khu vực trung tâm theo lịch xác nhận.'}]),JSON.stringify([{url:photos[i%photos.length],alt:name},{url:photos[(i+1)%photos.length],alt:`Trải nghiệm trong ${name}`}])]);
      tours.push(t);
      for(let j=0;j<destinationIndexes.length;j++) await client.query(`INSERT INTO tour_destination(tour_id,destination_id,order_index,day_number,estimated_minutes,activity,note) VALUES($1,$2,$3,$4,180,$5,$6)`,[t.tour_id,destinations[destinationIndexes[j]].destination_id,j+1,Math.min(j+1,days),`Tham quan ${destinations[destinationIndexes[j]].name}`,'Thứ tự có thể điều chỉnh theo điều kiện thực tế.']);
      for(let j=0;j<content.length;j++) await client.query(`INSERT INTO tour_content_item_link(tour_id,content_item_id,source_content_item_id,content_type,snapshot_content,sort_order) VALUES($1,$2,$2,$3,$4,$5)`,[t.tour_id,content[j].content_item_id,content[j].type,content[j].content,j+1]);
    }

    const coupons=[['CHAOMUNG10','Ưu đãi chào mừng',10,300000,500000],['GIADINH15','Ưu đãi tour gia đình',15,600000,1500000],['MUAHE2026','Ưu đãi mùa hè',12,500000,1000000],['DIUNGAY8','Ưu đãi tour trong ngày',8,200000,300000]];
    const couponIds=[];for(const [code,name,value,max,min] of coupons){couponIds.push((await one(client,`INSERT INTO coupon(code,name,description,discount_type,discount_value,max_discount_amount,min_order_amount,usage_limit,start_date,end_date,status,created_by) VALUES($1,$2,$3,'percentage',$4,$5,$6,500,CURRENT_DATE,CURRENT_DATE+180,'active',$7) RETURNING coupon_id`,[code,name,`${name} áp dụng theo điều kiện chương trình.`,value,max,min,staff.user_id])).coupon_id)}

    const bookings=[];
    for(let i=0;i<30;i++){
      const user=customers[i%customers.length], ti=i%tours.length, spec=tourData[ti], pax=1+(i%3), original=spec[3]+(pax-1)*spec[4], discount=i%3===0?Math.min(Math.round(original*0.1),300000):0, finalAmount=original-discount;
      const status=['confirmed','confirmed','pending','expired','canceled','waiting_manual_confirmation'][i%6]; const paymentStatus=status==='confirmed'?'paid':status==='expired'?'failed':status==='canceled'?(i%2?'refunded':'unpaid'):status==='waiting_manual_confirmation'?'pending':'unpaid';
      const b=await one(client,`INSERT INTO booking(user_id,tour_id,status,payment_status,coupon_id,original_amount,discount_amount,final_amount,departure_at,contact_phone,currency,date_created,canceled_at,canceled_by,cancel_reason) VALUES($1,$2,$3::varchar,$4::varchar,$5,$6,$7,$8,CURRENT_TIMESTAMP+(($9+12)||' days')::interval,$10,'VND',CURRENT_DATE-($9||' days')::interval,CASE WHEN $3::varchar='canceled' THEN CURRENT_TIMESTAMP-INTERVAL '1 day' END,CASE WHEN $3::varchar='canceled' THEN $11::int END,CASE WHEN $3::varchar='canceled' THEN 'Khách thay đổi lịch trình cá nhân' END) RETURNING booking_id`,[user.user_id,tours[ti].tour_id,status,paymentStatus,i%3===0?couponIds[0]:null,original,discount,finalAmount,i,user.phone||'0900000000',staff.user_id]); bookings.push(b);
      for(let p=0;p<pax;p++) await client.query(`INSERT INTO booking_detail(booking_id,passenger_name,age_category,price,seat_number,special_request) VALUES($1,$2,$3,$4,$5,$6)`,[b.booking_id,p===0?user.name:`${user.name} – thành viên ${p+1}`,p===0?'adult':'child',p===0?spec[3]:spec[4],`VN${String(i+1).padStart(2,'0')}-${p+1}`,i%10===0&&p===0?'Suất ăn chay':null]);
      const payState=paymentStatus==='paid'?'paid':paymentStatus==='refunded'?'refunded':paymentStatus==='failed'?'expired':'pending';
      await client.query(`INSERT INTO payment(booking_id,amount,status,transaction_code,currency,payment_code,payment_method,payment_provider,transfer_content,paid_at,expired_at) VALUES($1,$2,$3::varchar,$4,'VND',$5::varchar,'bank_transfer','sepay',$5,CASE WHEN $3::varchar IN('paid','refunded') THEN CURRENT_TIMESTAMP-INTERVAL '1 day' END,CURRENT_TIMESTAMP+INTERVAL '2 days')`,[b.booking_id,finalAmount,payState,['paid','refunded'].includes(payState)?`FT2622${String(10000000+i*7919)}`:null,`TVLVN${String(i+1).padStart(3,'0')}`]);
    }

    for(let i=0;i<30;i++){const li=i%locations.length;await client.query(`INSERT INTO review(user_id,location_id,rating,comment,status,images) VALUES($1,$2,$3,$4,'approved',$5)`,[customers[i%customers.length].user_id,locations[li].location_id,4+(i%3===0?1:0),['Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.','Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.','Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.'][i%3],photos[i%photos.length]])}

    const blogSubjects=['Văn Miếu – Quốc Tử Giám','Hoàng thành Thăng Long','Đại Nội Huế','Chùa Thiên Mụ','Phố cổ Hội An','Bà Nà Hills','Chợ Bến Thành','Bảo tàng Mỹ thuật','Núi Bà Đen','Tràm Chim','Bãi Sao Phú Quốc','Làng chài Hàm Ninh','Vườn quốc gia Cát Tiên','Ẩm thực Sài Gòn','Kinh nghiệm đặt tour gia đình'];
    for(let i=0;i<blogSubjects.length;i++){const title=`Cẩm Nang Khám Phá ${blogSubjects[i]}`;const slug=`cam-nang-${i+1}-${blogSubjects[i].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;const blog=await one(client,`INSERT INTO blog(user_id,title,content,slug,thumbnail,status,published_at) VALUES($1,$2,$3,$4,$5,'published',CURRENT_TIMESTAMP-($6||' days')::interval) RETURNING blog_id`,[customers[i%customers.length].user_id,title,`<p>${blogSubjects[i]} mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>`,photos[i%photos.length],i+1]);const categoryNames=['Cẩm nang','Điểm đến','Ẩm thực','Văn hóa','Lịch trình','Mẹo du lịch','Trải nghiệm'];for(const category of [categoryNames[i%categoryNames.length],categoryNames[(i+1)%categoryNames.length]]) await client.query(`INSERT INTO blog_blog_category(blog_id,blog_category_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,[blog.blog_id,blogCategories[category.toLocaleLowerCase('vi')]]);await client.query(`INSERT INTO blog_location(blog_id,location_id) VALUES($1,$2)`,[blog.blog_id,locations[i%locations.length].location_id]);}

    const postLines=['Buổi sáng yên bình và ánh sáng rất đẹp.','Một điểm đến có nhiều câu chuyện đáng để tìm hiểu.','Món ăn địa phương ngon hơn mình mong đợi.','Lịch trình hôm nay vừa đủ, không quá vội.','Kiến trúc và cảnh quan đều được giữ gìn tốt.','Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ.'];
    for(let i=0;i<36;i++){const user=customers[i%customers.length],di=i%destinations.length,li=(di*2+i%2)%locations.length;const p=await one(client,`INSERT INTO travel_post(user_id,content,destination_id,location_id,status,visibility) VALUES($1,$2,$3,$4,'published','public') RETURNING post_id`,[user.user_id,`${postLines[i%postLines.length]} ${destinationData[di][0]} thật sự là nơi nên ghé ít nhất một lần.`,destinations[di].destination_id,locations[li].location_id]);await client.query(`INSERT INTO travel_post_photo(post_id,image_url,display_order) VALUES($1,$2,0)`,[p.post_id,photos[i%photos.length]]);for(const liker of customers.slice(0,4).filter(x=>x.user_id!==user.user_id))await client.query(`INSERT INTO travel_post_like(post_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,[p.post_id,liker.user_id]);const cm=await one(client,`INSERT INTO travel_post_comment(post_id,user_id,content) VALUES($1,$2,'Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.') RETURNING comment_id`,[p.post_id,customers[(i+1)%customers.length].user_id]);await client.query(`INSERT INTO travel_post_comment(post_id,user_id,parent_comment_id,content) VALUES($1,$2,$3,'Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!')`,[p.post_id,user.user_id,cm.comment_id]);await client.query(`UPDATE travel_post SET like_count=(SELECT count(*) FROM travel_post_like WHERE post_id=$1),comment_count=2 WHERE post_id=$1`,[p.post_id]);}

    for(let i=0;i<8;i++){const d=destinations[i],leader=customers[i%customers.length],member=customers[(i+1)%customers.length];const g=await one(client,`INSERT INTO group_trip(name,visibility,leader_id,created_by,status,description,destination_id,destination_name,start_date,end_date,max_members) VALUES($1,$2,$3,$3,'active',$4,$5,$6,CURRENT_DATE+($7||' days')::interval,CURRENT_DATE+(($7+2)||' days')::interval,$8) RETURNING group_trip_id`,[`Cùng Khám Phá ${d.name}`,i%3===0?'private':'public',leader.user_id,`Nhóm nhỏ cùng lên lịch tham quan ${d.name} và trải nghiệm ẩm thực địa phương.`,d.destination_id,d.name,20+i*3,8+(i%4)*2]);await client.query(`INSERT INTO group_trip_member(group_trip_id,user_id,role,status) VALUES($1,$2,'leader','active'),($1,$3,'member','active')`,[g.group_trip_id,leader.user_id,member.user_id]);}

    await client.query('COMMIT');
    console.log(JSON.stringify({success:true,inserted:{users:0,destination_categories:categoryData.destination_category.length,tour_categories:categoryData.tour_category.length,blog_categories:categoryData.blog_category.length,destinations:destinations.length,locations:locations.length,maps:locations.length,views360:locations.length,tours:tours.length,tour_content_items:content.length,bookings:bookings.length,payments:bookings.length,reviews:30,blogs:blogSubjects.length,travel_posts:36,group_trips:8,coupons:coupons.length}},null,2));
  }catch(error){await client.query('ROLLBACK');throw error}finally{client.release();await db.pool.end()}
}

run().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
