require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../src/config/db');

const PASSWORD = 'Demo@123';
const MARKER = '[TRAVELLENS-DEMO-2026]';
const images = {
  hcm: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=85',
  danang: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=85',
  hanoi: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1600&q=85',
  halong: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  food: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=85',
};

async function one(client, sql, params = []) {
  return (await client.query(sql, params)).rows[0];
}

async function run() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const already = await one(client, 'SELECT user_id FROM users WHERE email = $1', ['demo.admin@travellens.vn']);
    if (already) {
      await client.query('ROLLBACK');
      console.log(JSON.stringify({ success: true, skipped: true, message: 'Full demo dataset already exists' }, null, 2));
      return;
    }

    const password = await bcrypt.hash(PASSWORD, 10);
    const userSpecs = [
      ['TravelLens Demo Admin', 'demo.admin@travellens.vn', 'admin', '0901000001', images.hcm],
      ['TravelLens Demo Staff', 'demo.staff@travellens.vn', 'staff', '0901000002', images.danang],
      ['Nguyễn Minh Anh', 'demo.customer1@travellens.vn', 'customer', '0901000011', images.hanoi],
      ['Trần Hoàng Nam', 'demo.customer2@travellens.vn', 'customer', '0901000012', images.halong],
      ['Lê Ngọc Linh', 'demo.customer3@travellens.vn', 'customer', '0901000013', images.beach],
    ];
    const users = [];
    for (const [name, email, role, phone, avatar] of userSpecs) {
      users.push(await one(client, `INSERT INTO users (name,email,password,role,status,phone,avatar_url,profile_info,address) VALUES ($1,$2,$3,$4,'active',$5,$6,$7,'Việt Nam') RETURNING user_id,name,email`, [name, email, password, role, phone, avatar, `${MARKER} realistic demo account`]));
    }
    const [admin, staff, c1, c2, c3] = users;

    const destinationCategory = await one(client, `INSERT INTO destination_category (name,description) VALUES ('Điểm đến nổi bật Demo',$1) RETURNING destination_category_id`, [`${MARKER} Thành phố và kỳ quan nổi bật`]);
    const tourCategory = await one(client, `INSERT INTO tour_category (name,description) VALUES ('Trải nghiệm bản địa Demo',$1) RETURNING tour_category_id`, [`${MARKER} Tour văn hóa, ẩm thực và thiên nhiên`]);
    const blogCategory = await one(client, `INSERT INTO blog_category (name,description) VALUES ('Cẩm nang Demo',$1) RETURNING blog_category_id`, [`${MARKER} Kinh nghiệm du lịch thực tế`]);

    const destinationSpecs = [
      ['TP. Hồ Chí Minh Demo', 'Thành phố năng động với di sản kiến trúc, ẩm thực đường phố và nhịp sống hiện đại.', images.hcm, 10.7769, 106.7009],
      ['Đà Nẵng Demo', 'Thành phố biển đáng sống, cửa ngõ khám phá miền Trung.', images.danang, 16.0544, 108.2022],
      ['Hà Nội Demo', 'Thủ đô nghìn năm văn hiến với phố cổ và văn hóa ẩm thực đặc sắc.', images.hanoi, 21.0278, 105.8342],
    ];
    const destinations = [];
    for (const spec of destinationSpecs) destinations.push(await one(client, `INSERT INTO travel_destination (name,description,thumbnail,destination_category_id,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING destination_id,name`, [spec[0], `${MARKER} ${spec[1]}`, spec[2], destinationCategory.destination_category_id, spec[3], spec[4]]));

    const locationSpecs = [
      [destinations[0], 'Dinh Độc Lập Demo', 'Di tích lịch sử giữa trung tâm thành phố.', images.hcm, 10.7770, 106.6953],
      [destinations[0], 'Chợ Bến Thành Demo', 'Biểu tượng mua sắm và ẩm thực lâu đời.', images.food, 10.7725, 106.6980],
      [destinations[1], 'Cầu Rồng Demo', 'Cây cầu biểu tượng bắc qua sông Hàn.', images.danang, 16.0611, 108.2275],
      [destinations[1], 'Bãi biển Mỹ Khê Demo', 'Bãi biển dài với cát trắng và nước trong.', images.beach, 16.0566, 108.2460],
      [destinations[2], 'Hồ Hoàn Kiếm Demo', 'Không gian văn hóa và cảnh quan trung tâm Hà Nội.', images.hanoi, 21.0287, 105.8520],
      [destinations[2], 'Phố cổ Hà Nội Demo', 'Khu phố lịch sử với những nghề truyền thống.', images.food, 21.0350, 105.8500],
    ];
    const locations = [];
    for (const [destination, name, description, thumbnail, lat, lng] of locationSpecs) locations.push(await one(client, `INSERT INTO location (name,description,thumbnail,destination_id,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING location_id,name`, [name, `${MARKER} ${description}`, thumbnail, destination.destination_id, lat, lng]));

    const contentSpecs = [
      ['highlight', 'Khám phá cùng hướng dẫn viên địa phương giàu kinh nghiệm'],
      ['inclusion', 'Xe đưa đón máy lạnh và nước uống đóng chai'],
      ['inclusion', 'Vé tham quan theo chương trình'],
      ['exclusion', 'Chi phí cá nhân ngoài chương trình'],
      ['requirement', 'Mang theo giấy tờ tùy thân và giày đi bộ thoải mái'],
      ['cancellation_policy', 'Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ'],
    ];
    const contentItems = [];
    for (const [type, content] of contentSpecs) contentItems.push(await one(client, `INSERT INTO tour_content_item (type,content,status,normalized_content) VALUES ($1,$2,'active',lower($2)) RETURNING content_item_id,type,content`, [type, `${MARKER} ${content}`]));

    const tourSpecs = [
      ['Sài Gòn Di Sản Một Ngày Demo', 'sai-gon-di-san-demo-2026', destinations[0], 890000, 590000, 0, images.hcm, '08:00 - 17:30', 24, 1, 0],
      ['Đà Nẵng Biển Và Phố Demo', 'da-nang-bien-va-pho-demo-2026', destinations[1], 1650000, 1050000, 0, images.danang, '07:30 - 18:00', 30, 2, 1],
      ['Hà Nội Phố Cổ Và Ẩm Thực Demo', 'ha-noi-pho-co-am-thuc-demo-2026', destinations[2], 750000, 450000, 0, images.hanoi, '09:00 - 16:00', 18, 1, 0],
      ['Hành Trình Việt Nam 6 Ngày Demo', 'hanh-trinh-viet-nam-6-ngay-demo-2026', destinations[0], 8990000, 6290000, 0, images.halong, '06:30', 20, 6, 5],
    ];
    const tours = [];
    for (let i = 0; i < tourSpecs.length; i += 1) {
      const [name, slug, destination, price, childPrice, infantPrice, thumbnail, schedule, capacity, days, nights] = tourSpecs[i];
      const tour = await one(client, `INSERT INTO tour (name,slug,description,short_description,price,child_price,infant_price,currency,schedule,capacity,tour_category_id,status,thumbnail,start_at,duration_days,duration_nights,start_time,end_time,languages,difficulty,minimum_participants,minimum_booking,maximum_booking,meeting_point,pickup_available,highlights,inclusions,exclusions,requirements,cancellation_policy,booking_policy,faqs,gallery) VALUES ($1,$2,$3,$4,$5,$6,$7,'VND',$8,$9,$10,'active',$11,CURRENT_TIMESTAMP + INTERVAL '14 days',$12,$13,'08:00','17:30','["Tiếng Việt","English"]'::jsonb,'easy',1,1,$9,$14,true,'["Trải nghiệm chân thực","Nhóm nhỏ"]'::jsonb,'["Vé tham quan","Hướng dẫn viên"]'::jsonb,'["Chi phí cá nhân"]'::jsonb,'["Giấy tờ tùy thân"]'::jsonb,'Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ','Đặt trước tối thiểu 24 giờ','[{"question":"Tour phù hợp trẻ em không?","answer":"Có, lịch trình phù hợp gia đình."}]'::jsonb,$15::jsonb) RETURNING tour_id,name`, [name, slug, `${MARKER} Hành trình được thiết kế chi tiết, cân bằng tham quan và nghỉ ngơi.`, `Khám phá ${destination.name} theo cách gần gũi nhất.`, price, childPrice, infantPrice, schedule, capacity, tourCategory.tour_category_id, thumbnail, days, nights, `Trung tâm ${destination.name}`, JSON.stringify([{ url: thumbnail, alt: name }, { url: images.food, alt: 'Ẩm thực địa phương' }])]);
      tours.push(tour);
      await client.query(`INSERT INTO tour_destination (tour_id,destination_id,order_index,day_number,estimated_minutes,activity,note) VALUES ($1,$2,1,1,240,$3,$4)`, [tour.tour_id, destination.destination_id, `Tham quan ${destination.name}`, MARKER]);
      for (let j = 0; j < contentItems.length; j += 1) await client.query(`INSERT INTO tour_content_item_link (tour_id,content_item_id,source_content_item_id,content_type,snapshot_content,sort_order) VALUES ($1,$2,$2,$3,$4,$5)`, [tour.tour_id, contentItems[j].content_item_id, contentItems[j].type, contentItems[j].content, j + 1]);
    }

    for (let i = 0; i < locations.length; i += 1) {
      await client.query(`INSERT INTO map (location_id,title,map_file,description,display_order) VALUES ($1,$2,$3,$4,1)`, [locations[i].location_id, `Bản đồ ${locations[i].name}`, images.hanoi, `${MARKER} Bản đồ khu vực tham quan`]);
      const view = await one(client, `INSERT INTO view360 (location_id,title,description,language,order_index) VALUES ($1,$2,$3,'vi',1) RETURNING view_id`, [locations[i].location_id, `360° ${locations[i].name}`, `${MARKER} Trải nghiệm không gian toàn cảnh`]);
      await client.query(`INSERT INTO view360_image (view_id,image_file,order_index) VALUES ($1,$2,1)`, [view.view_id, locationSpecs[i][3]]);
    }

    const coupon = await one(client, `INSERT INTO coupon (code,name,description,discount_type,discount_value,max_discount_amount,min_order_amount,usage_limit,start_date,end_date,status,created_by) VALUES ('DEMO2026','Ưu đãi trải nghiệm Demo',$1,'percentage',15,500000,500000,100,CURRENT_DATE - 1,CURRENT_DATE + 180,'active',$2) RETURNING coupon_id`, [`${MARKER} Giảm 15% tối đa 500.000đ`, staff.user_id]);
    const bookingSpecs = [
      [c1, tours[0], 'confirmed', 'paid', 2, coupon.coupon_id, 1780000, 267000, 1513000, 10],
      [c2, tours[1], 'pending', 'unpaid', 1, null, 1650000, 0, 1650000, 18],
      [c3, tours[2], 'confirmed', 'paid', 2, null, 1500000, 0, 1500000, -5],
      [c1, tours[3], 'canceled', 'refunded', 1, null, 8990000, 0, 8990000, 25],
      [c2, tours[0], 'waiting_manual_confirmation', 'pending', 1, null, 890000, 0, 890000, 12],
    ];
    const bookings = [];
    const payments = [];
    for (let i = 0; i < bookingSpecs.length; i += 1) {
      const [user, tour, status, paymentStatus, pax, couponId, original, discount, finalAmount, dayOffset] = bookingSpecs[i];
      const booking = await one(client, `INSERT INTO booking (user_id,tour_id,status,payment_status,coupon_id,original_amount,discount_amount,final_amount,departure_at,contact_phone,currency,date_created,canceled_at,canceled_by,cancel_reason) VALUES ($1,$2,$3::varchar,$4::varchar,$5,$6,$7,$8,CURRENT_TIMESTAMP + ($9 || ' days')::interval,$10,'VND',CURRENT_DATE - ($11 || ' days')::interval,CASE WHEN $3::varchar='canceled' THEN CURRENT_TIMESTAMP-INTERVAL '1 day' END,CASE WHEN $3::varchar='canceled' THEN $12::int ELSE NULL::int END,CASE WHEN $3::varchar='canceled' THEN 'Khách thay đổi kế hoạch' END) RETURNING booking_id`, [user.user_id, tour.tour_id, status, paymentStatus, couponId, original, discount, finalAmount, dayOffset, user === c1 ? '0901000011' : user === c2 ? '0901000012' : '0901000013', i + 1, staff.user_id]);
      bookings.push(booking);
      for (let p = 0; p < pax; p += 1) await client.query(`INSERT INTO booking_detail (booking_id,passenger_name,age_category,price,seat_number,special_request) VALUES ($1,$2,$3,$4,$5,$6)`, [booking.booking_id, p ? `${user.name} Junior` : user.name, p ? 'child' : 'adult', p ? Math.round(original * 0.35) : Math.round(original / pax), `D${i + 1}${p + 1}`, p === 0 && i === 0 ? 'Suất ăn chay' : null]);
      const payStatus = paymentStatus === 'paid' ? 'paid' : paymentStatus === 'refunded' ? 'refunded' : i === 1 ? 'pending' : 'pending';
      const payment = await one(client, `INSERT INTO payment (booking_id,amount,status,transaction_code,currency,payment_code,payment_method,payment_provider,transfer_content,paid_at,expired_at) VALUES ($1,$2,$3::varchar,$4,'VND',$5::varchar,'bank_transfer','sepay',$5::text,CASE WHEN $3::varchar IN ('paid','refunded') THEN CURRENT_TIMESTAMP-INTERVAL '2 days' END,CURRENT_TIMESTAMP+INTERVAL '2 days') RETURNING payment_id`, [booking.booking_id, finalAmount, payStatus, payStatus === 'paid' ? `DEMO-TXN-${i + 1}` : null, `TVLDEMO${String(i + 1).padStart(3, '0')}`]);
      payments.push(payment);
    }
    await client.query(`INSERT INTO refund_request (booking_id,payment_id,requested_by,reason,refund_amount,status,staff_note,reviewed_by,reviewed_at) VALUES ($1,$2,$3,'Khách yêu cầu đổi lịch nhưng không còn ngày phù hợp',$4,'pending',NULL,NULL,NULL),($5,$6,$7,'Tour đã được hoàn tiền',$8,'completed','Đã chuyển khoản hoàn tiền',$9,CURRENT_TIMESTAMP-INTERVAL '1 day')`, [bookings[0].booking_id, payments[0].payment_id, c1.user_id, 1513000, bookings[3].booking_id, payments[3].payment_id, c1.user_id, 8990000, staff.user_id]);

    for (let i = 0; i < 3; i += 1) {
      const review = await one(client, `INSERT INTO review (user_id,location_id,rating,comment,status,images) VALUES ($1,$2,$3,$4,'approved',$5) RETURNING review_id`, [[c1,c2,c3][i].user_id, locations[i].location_id, 5-i%2, `${MARKER} Không gian đẹp, nhân viên thân thiện và trải nghiệm rất đáng nhớ.`, locationSpecs[i][3]]);
      await client.query(`INSERT INTO review_photo (review_id,photo_url,original_name,mime_type) VALUES ($1,$2,'demo-review.jpg','image/jpeg')`, [review.review_id, locationSpecs[i][3]]);
    }
    await client.query(`INSERT INTO review (user_id,booking_id,tour_id,rating,comment,status) VALUES ($1,$2,$3,5,$4,'approved')`, [c3.user_id, bookings[2].booking_id, tours[2].tour_id, `${MARKER} Tour tổ chức chuyên nghiệp, lịch trình vừa phải.`]);

    const blogs = [];
    for (let i = 0; i < 3; i += 1) {
      const blog = await one(client, `INSERT INTO blog (user_id,title,content,slug,thumbnail,status,published_at) VALUES ($1,$2,$3,$4,$5,'published',CURRENT_TIMESTAMP-($6||' days')::interval) RETURNING blog_id`, [[c1,c2,c3][i].user_id, [`48 giờ khám phá Sài Gòn như người bản địa Demo`,`Đà Nẵng mùa đẹp nhất trong năm Demo`,`Ăn gì ở phố cổ Hà Nội Demo`][i], `<p>${MARKER} Đây là cẩm nang được viết từ trải nghiệm thực tế.</p><img src="${[images.hcm,images.danang,images.food][i]}" alt="Demo"><h2>Lịch trình gợi ý</h2><p>Hãy bắt đầu sớm, dành thời gian trò chuyện với người địa phương và ưu tiên phương tiện công cộng.</p>`, `demo-blog-${i+1}-2026`, i === 1 ? null : [images.hcm,images.danang,images.food][i], i + 1]);
      blogs.push(blog);
      await client.query(`INSERT INTO blog_blog_category (blog_id,blog_category_id) VALUES ($1,$2)`, [blog.blog_id, blogCategory.blog_category_id]);
      await client.query(`INSERT INTO blog_location (blog_id,location_id) VALUES ($1,$2)`, [blog.blog_id, locations[i*2].location_id]);
      const parent = await one(client, `INSERT INTO blog_comment (blog_id,user_id,content) VALUES ($1,$2,$3) RETURNING comment_id`, [blog.blog_id, [c2,c3,c1][i].user_id, `${MARKER} Bài viết hữu ích, cảm ơn bạn đã chia sẻ.`]);
      await client.query(`INSERT INTO blog_comment (blog_id,user_id,parent_comment_id,content) VALUES ($1,$2,$3,$4)`, [blog.blog_id, [c1,c2,c3][i].user_id, parent.comment_id, 'Cảm ơn bạn, chúc bạn có chuyến đi vui vẻ!']);
    }

    for (let i = 0; i < 5; i += 1) {
      const author = [c1,c2,c3][i%3];
      const post = await one(client, `INSERT INTO travel_post (user_id,content,destination_id,location_id,status,visibility) VALUES ($1,$2,$3,$4,'published','public') RETURNING post_id`, [author.user_id, `${MARKER} ${['Buổi sáng bình yên và rất nhiều góc chụp đẹp.','Món ăn địa phương ngon hơn mong đợi.','Một lịch trình cuối tuần đáng lưu lại.','Hoàng hôn hôm nay thực sự tuyệt vời.','Mẹo nhỏ: hãy đến sớm để tránh đông.'][i]}`, destinations[i%3].destination_id, locations[i%locations.length].location_id]);
      await client.query(`INSERT INTO travel_post_photo (post_id,image_url,display_order) VALUES ($1,$2,0)`, [post.post_id, Object.values(images)[i%6]]);
      for (const liker of [c1,c2,c3].filter(u=>u.user_id!==author.user_id)) await client.query(`INSERT INTO travel_post_like (post_id,user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [post.post_id, liker.user_id]);
      const comment = await one(client, `INSERT INTO travel_post_comment (post_id,user_id,content) VALUES ($1,$2,$3) RETURNING comment_id`, [post.post_id, [c2,c3,c1][i%3].user_id, 'Nhìn hấp dẫn quá, mình sẽ thêm vào kế hoạch!']);
      await client.query(`INSERT INTO travel_post_comment (post_id,user_id,parent_comment_id,content) VALUES ($1,$2,$3,'Đi cùng nhé, cuối tuần này mình đang rảnh.')`, [post.post_id, author.user_id, comment.comment_id]);
      await client.query(`INSERT INTO travel_post_share (post_id,user_id,platform,counted) VALUES ($1,$2,'copy_link',true)`, [post.post_id, author.user_id]);
      await client.query(`UPDATE travel_post SET like_count=2,comment_count=2,share_count=1 WHERE post_id=$1`, [post.post_id]);
      if (i === 4) await client.query(`INSERT INTO travel_post_report (post_id,user_id,reason,description,status) VALUES ($1,$2,'spam','Bài demo để kiểm thử moderation','pending')`, [post.post_id, c2.user_id]);
    }

    const group = await one(client, `INSERT INTO group_trip (name,visibility,leader_id,created_by,status,description,destination_id,destination_name,start_date,end_date,max_members) VALUES ('Team khám phá Đà Nẵng Demo','public',$1,$1,'active',$2,$3,$4,CURRENT_DATE+30,CURRENT_DATE+33,8) RETURNING group_trip_id`, [c1.user_id, `${MARKER} Nhóm mở dành cho người yêu biển và ẩm thực miền Trung.`, destinations[1].destination_id, destinations[1].name]);
    await client.query(`INSERT INTO group_trip_member (group_trip_id,user_id,role,status) VALUES ($1,$2,'leader','active'),($1,$3,'member','active')`, [group.group_trip_id, c1.user_id, c2.user_id]);
    await client.query(`INSERT INTO group_trip_itinerary_item (group_trip_id,itinerary_date,start_time,title,description,location_id,order_index) VALUES ($1,CURRENT_DATE+30,'08:00','Check-in Cầu Rồng',$2,$3,1),($1,CURRENT_DATE+31,'06:00','Đón bình minh Mỹ Khê',$2,$4,2)`, [group.group_trip_id, MARKER, locations[2].location_id, locations[3].location_id]);
    await client.query(`INSERT INTO group_trip_invite (group_trip_id,invited_user_id,invited_email,invited_by,token_hash,status,expires_at) VALUES ($1,$2,$3,$4,$5,'pending',CURRENT_TIMESTAMP+INTERVAL '7 days')`, [group.group_trip_id, c3.user_id, c3.email, c1.user_id, crypto.createHash('sha256').update('demo-group-invite-2026').digest('hex')]);

    await client.query('COMMIT');
    console.log(JSON.stringify({ success: true, marker: MARKER, password: PASSWORD, accounts: users.map(({ email }) => email), inserted: { users: users.length, destinations: destinations.length, locations: locations.length, tours: tours.length, bookings: bookings.length, payments: payments.length, blogs: blogs.length, travel_posts: 5, group_trips: 1 } }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
