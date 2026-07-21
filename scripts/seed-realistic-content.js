require('dotenv').config();

const db = require('../src/config/db');

const images = {
  ninhKieu: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
  floatingMarket: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=85',
  oldHouse: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=85',
  temple: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85',
  garden: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
  food: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=85',
};

async function one(client, sql, params = []) {
  return (await client.query(sql, params)).rows[0];
}

async function run() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const existing = await one(client, `SELECT tour_id FROM tour WHERE slug='can-tho-song-nuoc-va-van-hoa'`);
    if (existing) {
      await client.query('ROLLBACK');
      console.log(JSON.stringify({ success: true, skipped: true, message: 'Realistic content dataset already exists' }, null, 2));
      return;
    }

    const users = (await client.query(`SELECT user_id,name,email,role FROM users WHERE status='active' ORDER BY user_id`)).rows;
    const customers = users.filter((user) => user.role === 'customer');
    const staff = users.find((user) => user.role === 'staff') || users.find((user) => user.role === 'admin');
    const author = users.find((user) => user.role === 'admin') || staff;
    if (customers.length < 3 || !staff || !author) throw new Error('At least 3 active customers, 1 staff and 1 admin are required');
    const [c1, c2, c3, c4 = customers[0], c5 = customers[1]] = customers;

    let destinationCategory = await one(client, `SELECT destination_category_id FROM destination_category WHERE lower(name)=lower('Sinh thái') LIMIT 1`);
    if (!destinationCategory) destinationCategory = await one(client, `INSERT INTO destination_category(name,description) VALUES('Sinh thái','Điểm đến gần gũi thiên nhiên và văn hóa bản địa.') RETURNING destination_category_id`);
    let tourCategory = await one(client, `SELECT tour_category_id FROM tour_category ORDER BY tour_category_id LIMIT 1`);
    if (!tourCategory) tourCategory = await one(client, `INSERT INTO tour_category(name,description) VALUES('Khám phá','Hành trình khám phá văn hóa, lịch sử và thiên nhiên.') RETURNING tour_category_id`);
    let blogCategory = await one(client, `SELECT blog_category_id FROM blog_category WHERE lower(name)=lower('Tin Tức') LIMIT 1`);
    if (!blogCategory) blogCategory = await one(client, `INSERT INTO blog_category(name,description) VALUES('Cẩm nang','Kinh nghiệm và gợi ý hữu ích cho chuyến đi.') RETURNING blog_category_id`);

    const destinationSpecs = [
      ['Bến Ninh Kiều', '<p>Bến Ninh Kiều nằm bên dòng Hậu Giang, là biểu tượng du lịch của Cần Thơ với công viên ven sông, cầu đi bộ và khu chợ đêm sôi động.</p>', images.ninhKieu, 10.0344, 105.7886],
      ['Chợ nổi Cái Răng', '<p>Chợ nổi Cái Răng là không gian giao thương đặc trưng của miền Tây, nhộn nhịp từ sáng sớm với ghe thuyền bán trái cây, nông sản và món ăn địa phương.</p>', images.floatingMarket, 10.0060, 105.7469],
      ['Nhà cổ Bình Thủy', '<p>Nhà cổ Bình Thủy được xây dựng vào cuối thế kỷ XIX, nổi bật với sự giao thoa giữa kiến trúc Pháp và không gian sinh hoạt truyền thống Nam Bộ.</p>', images.oldHouse, 10.0611, 105.7585],
      ['Thiền viện Trúc Lâm Phương Nam', '<p>Thiền viện Trúc Lâm Phương Nam có không gian thanh tịnh, kiến trúc Phật giáo truyền thống và khuôn viên rộng nhiều cây xanh.</p>', images.temple, 9.9962, 105.6738],
      ['Cồn Sơn', '<p>Cồn Sơn là điểm du lịch cộng đồng giữa sông Hậu, nơi du khách trải nghiệm vườn cây ăn trái, làm bánh dân gian và đời sống miệt vườn.</p>', images.garden, 10.1150, 105.7356],
    ];
    const destinations = [];
    for (const [name, description, thumbnail, latitude, longitude] of destinationSpecs) {
      destinations.push(await one(client, `INSERT INTO travel_destination(name,description,thumbnail,destination_category_id,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6) RETURNING destination_id,name`, [name, description, thumbnail, destinationCategory.destination_category_id, latitude, longitude]));
    }

    const locationSpecs = [
      [0, 'Công viên Ninh Kiều', 'Không gian đi bộ ven sông với hàng cây xanh và góc nhìn rộng ra dòng Hậu Giang.', images.ninhKieu, 10.0348, 105.7890],
      [0, 'Cầu đi bộ Ninh Kiều', 'Cây cầu đi bộ nổi bật với thiết kế mềm mại, là vị trí ngắm cảnh và chụp ảnh đẹp vào buổi tối.', images.ninhKieu, 10.0362, 105.7911],
      [1, 'Bến tàu chợ nổi', 'Điểm đón khách lên thuyền để bắt đầu hành trình tham quan chợ nổi vào sáng sớm.', images.floatingMarket, 10.0102, 105.7510],
      [1, 'Khu ghe ẩm thực', 'Khu vực tập trung các ghe phục vụ cà phê, bún riêu, hủ tiếu và đặc sản địa phương.', images.food, 10.0055, 105.7474],
      [2, 'Nhà chính Bình Thủy', 'Không gian kiến trúc chính với nội thất cổ, nền gạch hoa và các chi tiết trang trí tinh xảo.', images.oldHouse, 10.0612, 105.7586],
      [2, 'Vườn lan Bình Thủy', 'Khu vườn xanh bao quanh nhà cổ, trồng nhiều giống hoa và cây cảnh đặc trưng.', images.garden, 10.0610, 105.7582],
      [3, 'Chánh điện', 'Công trình trung tâm của thiền viện với kiến trúc gỗ truyền thống và không gian trang nghiêm.', images.temple, 9.9961, 105.6737],
      [3, 'Vườn thiền', 'Khuôn viên yên tĩnh với hồ nước, cây xanh và lối đi dành cho khách tham quan.', images.garden, 9.9958, 105.6741],
      [4, 'Vườn trái cây Cồn Sơn', 'Khu vườn theo mùa, nơi du khách tìm hiểu cách chăm sóc và thưởng thức trái cây tại chỗ.', images.garden, 10.1153, 105.7358],
      [4, 'Khu làm bánh dân gian', 'Không gian trải nghiệm làm bánh lá mít, bánh khọt và các món bánh truyền thống Nam Bộ.', images.food, 10.1148, 105.7354],
    ];
    const locations = [];
    for (const [destinationIndex, name, description, thumbnail, latitude, longitude] of locationSpecs) {
      locations.push(await one(client, `INSERT INTO location(name,description,thumbnail,destination_id,latitude,longitude,is_deleted) VALUES($1,$2,$3,$4,$5,$6,false) RETURNING location_id,name`, [name, description, thumbnail, destinations[destinationIndex].destination_id, latitude, longitude]));
    }

    for (let i = 0; i < locations.length; i += 1) {
      await client.query(`INSERT INTO map(location_id,title,map_file,description,display_order) VALUES($1,$2,$3,$4,1)`, [locations[i].location_id, `Bản đồ ${locations[i].name}`, locationSpecs[i][3], `Sơ đồ tham quan và các điểm tiện ích tại ${locations[i].name}.`]);
      const view = await one(client, `INSERT INTO view360(location_id,title,description,language,order_index) VALUES($1,$2,$3,'vi',1) RETURNING view_id`, [locations[i].location_id, `Toàn cảnh ${locations[i].name}`, `Khám phá không gian ${locations[i].name} qua hình ảnh toàn cảnh.`]);
      await client.query(`INSERT INTO view360_image(view_id,image_file,order_index) VALUES($1,$2,1)`, [view.view_id, locationSpecs[i][3]]);
    }

    const tourSpecs = [
      ['Cần Thơ Sông Nước và Văn Hóa', 'can-tho-song-nuoc-va-van-hoa', 1690000, 1090000, images.floatingMarket, 2, 1, 24, [0, 1]],
      ['Bình Minh Chợ Nổi Cái Răng', 'binh-minh-cho-noi-cai-rang', 650000, 420000, images.floatingMarket, 1, 0, 20, [1]],
      ['Dấu Xưa Bình Thủy', 'dau-xua-binh-thuy', 590000, 390000, images.oldHouse, 1, 0, 18, [2]],
      ['Cồn Sơn Trải Nghiệm Miệt Vườn', 'con-son-trai-nghiem-miet-vuon', 890000, 590000, images.garden, 1, 0, 25, [4]],
      ['Cần Thơ An Nhiên', 'can-tho-an-nhien', 1290000, 850000, images.temple, 1, 0, 22, [3, 4]],
      ['Hành Trình Cần Thơ Ba Ngày', 'hanh-trinh-can-tho-ba-ngay', 4290000, 2890000, images.ninhKieu, 3, 2, 20, [0, 1, 2, 3, 4]],
    ];
    const tours = [];
    for (let i = 0; i < tourSpecs.length; i += 1) {
      const [name, slug, price, childPrice, thumbnail, days, nights, capacity, destinationIndexes] = tourSpecs[i];
      const tour = await one(client, `INSERT INTO tour(name,slug,description,short_description,price,child_price,infant_price,currency,schedule,capacity,tour_category_id,status,thumbnail,start_at,duration_days,duration_nights,start_time,end_time,languages,difficulty,minimum_participants,minimum_booking,maximum_booking,meeting_point,pickup_available,highlights,inclusions,exclusions,requirements,cancellation_policy,booking_policy,faqs,gallery) VALUES($1,$2,$3,$4,$5,$6,0,'VND',$7,$8,$9,'active',$10,CURRENT_TIMESTAMP+INTERVAL '15 days',$11,$12,'07:30','17:30','["Tiếng Việt","English"]'::jsonb,'easy',1,1,$8,'Bến Ninh Kiều, Cần Thơ',true,$13::jsonb,$14::jsonb,$15::jsonb,$16::jsonb,'Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.','Đặt trước tối thiểu 24 giờ.',$17::jsonb,$18::jsonb) RETURNING tour_id,name`, [name, slug, `Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.`, `Khám phá ${name.toLowerCase()} với hướng dẫn viên địa phương.`, price, childPrice, days > 1 ? 'Theo chương trình từng ngày' : '07:30 – 17:30', capacity, tourCategory.tour_category_id, thumbnail, days, nights, JSON.stringify(['Hướng dẫn viên địa phương', 'Nhóm nhỏ', 'Trải nghiệm văn hóa bản địa']), JSON.stringify(['Xe đưa đón theo lịch trình', 'Vé tham quan', 'Nước uống', 'Hướng dẫn viên']), JSON.stringify(['Chi phí cá nhân', 'Đồ uống ngoài chương trình']), JSON.stringify(['Mang theo giấy tờ tùy thân', 'Trang phục thoải mái']), JSON.stringify([{ question: 'Tour có phù hợp với trẻ em không?', answer: 'Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.' }]), JSON.stringify([{ url: thumbnail, alt: name }, { url: images.food, alt: 'Ẩm thực miền Tây' }])]);
      tours.push(tour);
      for (let order = 0; order < destinationIndexes.length; order += 1) await client.query(`INSERT INTO tour_destination(tour_id,destination_id,order_index,day_number,estimated_minutes,activity,note) VALUES($1,$2,$3,$4,180,$5,$6)`, [tour.tour_id, destinations[destinationIndexes[order]].destination_id, order + 1, Math.min(order + 1, days), `Tham quan ${destinations[destinationIndexes[order]].name}`, 'Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.']);
    }

    const coupon = await one(client, `INSERT INTO coupon(code,name,description,discount_type,discount_value,max_discount_amount,min_order_amount,usage_limit,start_date,end_date,status,created_by) VALUES('MIENTAY15','Ưu đãi khám phá miền Tây','Giảm 15% cho các hành trình tại Cần Thơ.','percentage',15,500000,500000,200,CURRENT_DATE,CURRENT_DATE+180,'active',$1) RETURNING coupon_id`, [staff.user_id]);
    const bookingSpecs = [
      [c1, 0, 'confirmed', 'paid', 2, true], [c2, 1, 'confirmed', 'paid', 1, false],
      [c3, 3, 'pending', 'unpaid', 2, false], [c4, 5, 'confirmed', 'paid', 1, true],
      [c5, 2, 'canceled', 'refunded', 2, false], [c1, 4, 'waiting_manual_confirmation', 'pending', 1, false],
      [c2, 3, 'confirmed', 'paid', 3, true], [c3, 0, 'expired', 'failed', 1, false],
      [c4, 1, 'cancel_pending', 'paid', 2, false], [c5, 5, 'confirmed', 'paid', 2, true],
    ];
    const bookings = [];
    for (let i = 0; i < bookingSpecs.length; i += 1) {
      const [user, tourIndex, status, paymentStatus, passengerCount, useCoupon] = bookingSpecs[i];
      const spec = tourSpecs[tourIndex];
      const original = spec[2] + Math.max(0, passengerCount - 1) * spec[3];
      const discount = useCoupon ? Math.min(Math.round(original * 0.15), 500000) : 0;
      const finalAmount = original - discount;
      const booking = await one(client, `INSERT INTO booking(user_id,tour_id,status,payment_status,coupon_id,original_amount,discount_amount,final_amount,departure_at,contact_phone,currency,date_created,canceled_at,canceled_by,cancel_reason) VALUES($1,$2,$3::varchar,$4::varchar,$5,$6,$7,$8,CURRENT_TIMESTAMP+(($9+10)||' days')::interval,$10,'VND',CURRENT_DATE-($9||' days')::interval,CASE WHEN $3::varchar='canceled' THEN CURRENT_TIMESTAMP-INTERVAL '2 days' END,CASE WHEN $3::varchar='canceled' THEN $11::int END,CASE WHEN $3::varchar='canceled' THEN 'Khách thay đổi kế hoạch cá nhân' END) RETURNING booking_id`, [user.user_id, tours[tourIndex].tour_id, status, paymentStatus, useCoupon ? coupon.coupon_id : null, original, discount, finalAmount, i, user.phone || '0900000000', staff.user_id]);
      bookings.push(booking);
      for (let p = 0; p < passengerCount; p += 1) await client.query(`INSERT INTO booking_detail(booking_id,passenger_name,age_category,price,seat_number,special_request) VALUES($1,$2,$3,$4,$5,$6)`, [booking.booking_id, p === 0 ? user.name : `${user.name} – thành viên ${p + 1}`, p === 0 ? 'adult' : 'child', p === 0 ? spec[2] : spec[3], `CT${i + 1}-${p + 1}`, i === 0 && p === 0 ? 'Suất ăn chay' : null]);
      const payState = paymentStatus === 'paid' ? 'paid' : paymentStatus === 'refunded' ? 'refunded' : paymentStatus === 'failed' ? 'expired' : 'pending';
      await client.query(`INSERT INTO payment(booking_id,amount,status,transaction_code,currency,payment_code,payment_method,payment_provider,transfer_content,paid_at,expired_at) VALUES($1,$2,$3::varchar,$4,'VND',$5::varchar,'bank_transfer','sepay',$5,CASE WHEN $3::varchar IN('paid','refunded') THEN CURRENT_TIMESTAMP-INTERVAL '2 days' END,CURRENT_TIMESTAMP+INTERVAL '2 days')`, [booking.booking_id, finalAmount, payState, ['FT262210458721','FT262211037864',null,'FT262212349105','FT262213882417',null,'FT262214773209',null,'FT262215630842','FT262216998351'][i], `TVLCT${String(i + 1).padStart(3, '0')}`]);
    }

    const reviewSpecs = [[c1,0,5],[c2,2,4],[c3,4,5],[c4,6,5],[c5,8,4],[c1,9,5]];
    for (let i = 0; i < reviewSpecs.length; i += 1) await client.query(`INSERT INTO review(user_id,location_id,rating,comment,status,images) VALUES($1,$2,$3,$4,'approved',$5)`, [reviewSpecs[i][0].user_id, locations[reviewSpecs[i][1]].location_id, reviewSpecs[i][2], ['Không gian ven sông thoáng mát, buổi tối lên đèn rất đẹp.','Nhiều thông tin thú vị, hướng dẫn tham quan rõ ràng.','Kiến trúc được giữ gìn tốt và khuôn viên rất yên tĩnh.','Chánh điện trang nghiêm, cảnh quan sạch và thanh bình.','Vườn cây xanh mát, chủ vườn thân thiện và nhiệt tình.','Trải nghiệm làm bánh vui, phù hợp cho gia đình có trẻ nhỏ.'][i], locationSpecs[reviewSpecs[i][1]][3]]);

    const blogSpecs = [
      [c1, 'Kinh Nghiệm Đi Chợ Nổi Cái Răng Từ Sáng Sớm', 'kinh-nghiem-di-cho-noi-cai-rang', images.floatingMarket, '<p>Chợ nổi hoạt động nhộn nhịp nhất từ 5 đến 7 giờ sáng. Bạn nên đặt thuyền trước, mặc áo phao và chuẩn bị áo khoác mỏng.</p><h2>Những món nên thử</h2><p>Cà phê kho, hủ tiếu và trái cây theo mùa là những trải nghiệm không nên bỏ lỡ.</p>'],
      [c2, 'Một Buổi Tối Dạo Bến Ninh Kiều', 'mot-buoi-toi-dao-ben-ninh-kieu', images.ninhKieu, '<p>Khi thành phố lên đèn, Bến Ninh Kiều trở nên nhộn nhịp với cầu đi bộ, chợ đêm và các hàng quán đặc sản.</p><p>Hãy dành thời gian đi bộ ven sông và ngắm tàu thuyền trên dòng Hậu Giang.</p>'],
      [c3, 'Nhà Cổ Bình Thủy và Dấu Ấn Kiến Trúc Nam Bộ', 'nha-co-binh-thuy-va-kien-truc-nam-bo', images.oldHouse, '<p>Ngôi nhà gây ấn tượng bởi mặt tiền kiểu Pháp nhưng vẫn giữ cách bố trí và không gian thờ tự truyền thống của người Nam Bộ.</p><p>Nên tham quan cùng thuyết minh viên để hiểu rõ hơn về lịch sử gia đình và từng món nội thất.</p>'],
      [c4, 'Cồn Sơn – Một Ngày Làm Người Miệt Vườn', 'con-son-mot-ngay-lam-nguoi-miet-vuon', images.garden, '<p>Cồn Sơn mang đến trải nghiệm gần gũi qua vườn trái cây, bè cá và các lớp làm bánh dân gian.</p><p>Du lịch cộng đồng tại đây tạo cảm giác thân tình, chậm rãi và rất phù hợp cho gia đình.</p>'],
    ];
    for (let i = 0; i < blogSpecs.length; i += 1) {
      const [user,title,slug,thumbnail,content] = blogSpecs[i];
      const blog = await one(client, `INSERT INTO blog(user_id,title,content,slug,thumbnail,status,published_at) VALUES($1,$2,$3,$4,$5,'published',CURRENT_TIMESTAMP-($6||' days')::interval) RETURNING blog_id`, [user.user_id,title,content,slug,thumbnail,i+1]);
      await client.query(`INSERT INTO blog_blog_category(blog_id,blog_category_id) VALUES($1,$2)`, [blog.blog_id,blogCategory.blog_category_id]);
      await client.query(`INSERT INTO blog_location(blog_id,location_id) VALUES($1,$2)`, [blog.blog_id,locations[i*2].location_id]);
      await client.query(`INSERT INTO blog_comment(blog_id,user_id,content) VALUES($1,$2,$3)`, [blog.blog_id,[c2,c3,c4,c5][i].user_id,'Bài viết hữu ích, mình đã lưu lại cho chuyến đi sắp tới.']);
    }

    const postTexts = ['Hoàng hôn ở Bến Ninh Kiều rất đẹp, gió mát và không khí ven sông dễ chịu.','Dậy từ 5 giờ để đi chợ nổi hoàn toàn xứng đáng, mình đã thử hủ tiếu ngay trên ghe.','Nhà cổ Bình Thủy có nhiều chi tiết kiến trúc tinh tế và câu chuyện rất thú vị.','Một buổi sáng bình yên tại Thiền viện Trúc Lâm Phương Nam.','Trái cây ở Cồn Sơn đang đúng mùa, chủ vườn hướng dẫn rất nhiệt tình.','Cầu đi bộ Ninh Kiều là nơi mình thích nhất khi thành phố lên đèn.','Lần đầu tự tay làm bánh dân gian, thành phẩm chưa đẹp nhưng rất ngon.','Ba ngày ở Cần Thơ đủ để mình yêu thêm nhịp sống miền sông nước.'];
    for (let i = 0; i < postTexts.length; i += 1) {
      const user = customers[i % customers.length];
      const post = await one(client, `INSERT INTO travel_post(user_id,content,destination_id,location_id,status,visibility) VALUES($1,$2,$3,$4,'published','public') RETURNING post_id`, [user.user_id,postTexts[i],destinations[i%destinations.length].destination_id,locations[i%locations.length].location_id]);
      await client.query(`INSERT INTO travel_post_photo(post_id,image_url,display_order) VALUES($1,$2,0)`, [post.post_id,locationSpecs[i%locationSpecs.length][3]]);
      for (const liker of customers.slice(0,3).filter((item)=>item.user_id!==user.user_id)) await client.query(`INSERT INTO travel_post_like(post_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING`, [post.post_id,liker.user_id]);
      const comment = await one(client, `INSERT INTO travel_post_comment(post_id,user_id,content) VALUES($1,$2,$3) RETURNING comment_id`, [post.post_id,customers[(i+1)%customers.length].user_id,'Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.']);
      await client.query(`INSERT INTO travel_post_comment(post_id,user_id,parent_comment_id,content) VALUES($1,$2,$3,$4)`, [post.post_id,user.user_id,comment.comment_id,'Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!']);
      await client.query(`UPDATE travel_post SET like_count=(SELECT count(*) FROM travel_post_like WHERE post_id=$1),comment_count=2 WHERE post_id=$1`, [post.post_id]);
    }

    const group1 = await one(client, `INSERT INTO group_trip(name,visibility,leader_id,created_by,status,description,destination_id,destination_name,start_date,end_date,max_members) VALUES('Cuối Tuần Khám Phá Cần Thơ','public',$1,$1,'active','Cùng khám phá chợ nổi, Bến Ninh Kiều và ẩm thực địa phương.',$2,$3,CURRENT_DATE+20,CURRENT_DATE+22,10) RETURNING group_trip_id`, [c1.user_id,destinations[0].destination_id,destinations[0].name]);
    await client.query(`INSERT INTO group_trip_member(group_trip_id,user_id,role,status) VALUES($1,$2,'leader','active'),($1,$3,'member','active')`, [group1.group_trip_id,c1.user_id,c2.user_id]);
    const group2 = await one(client, `INSERT INTO group_trip(name,visibility,leader_id,created_by,status,description,destination_id,destination_name,start_date,end_date,max_members) VALUES('Trải Nghiệm Miệt Vườn Cồn Sơn','public',$1,$1,'active','Nhóm nhỏ trải nghiệm vườn cây và làm bánh dân gian tại Cồn Sơn.',$2,$3,CURRENT_DATE+28,CURRENT_DATE+29,8) RETURNING group_trip_id`, [c3.user_id,destinations[4].destination_id,destinations[4].name]);
    await client.query(`INSERT INTO group_trip_member(group_trip_id,user_id,role,status) VALUES($1,$2,'leader','active'),($1,$3,'member','active')`, [group2.group_trip_id,c3.user_id,c4.user_id]);

    await client.query('COMMIT');
    console.log(JSON.stringify({ success:true, inserted:{ users:0,destinations:destinations.length,locations:locations.length,maps:locations.length,views360:locations.length,tours:tours.length,bookings:bookings.length,payments:bookings.length,reviews:reviewSpecs.length,blogs:blogSpecs.length,travel_posts:postTexts.length,group_trips:2 } },null,2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error)=>{ console.error(error.stack||error.message); process.exitCode=1; });
