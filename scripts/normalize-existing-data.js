require('dotenv').config();

const db = require('../src/config/db');

async function updateById(client, table, idColumn, id, values) {
  const entries = Object.entries(values);
  const setters = entries.map(([column], index) => `"${column}" = $${index + 1}`).join(', ');
  const params = entries.map(([, value]) => value);
  params.push(id);
  const result = await client.query(
    `UPDATE "${table}" SET ${setters} WHERE "${idColumn}" = $${params.length}`,
    params,
  );
  return result.rowCount;
}

async function updateMany(client, table, idColumn, records) {
  let count = 0;
  for (const [id, values] of Object.entries(records)) {
    count += await updateById(client, table, idColumn, Number(id), values);
  }
  return count;
}

const destinations = {
  2: { name: 'Dinh Độc Lập', description: '<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>', latitude: 10.777035, longitude: 106.695488 },
  3: { name: 'Bến Nhà Rồng – Bảo tàng Hồ Chí Minh', description: '<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>', latitude: 10.768211, longitude: 106.70667 },
  4: { name: 'Công viên Võ Chí Công', description: '<p>Không gian công cộng xanh, thoáng đãng, phù hợp để đi bộ, thư giãn và khám phá nhịp sống đô thị.</p>', latitude: 10.7946, longitude: 106.7423 },
  5: { name: 'Chợ nổi Cái Răng', description: '<p>Chợ nổi Cái Răng là nét văn hóa sông nước đặc trưng của Cần Thơ, nhộn nhịp nhất vào sáng sớm với hoạt động mua bán nông sản và ẩm thực trên ghe thuyền.</p>', latitude: 10.006, longitude: 105.7469 },
  6: { name: 'Làng du lịch sinh thái Ông Đề', description: '<p>Làng du lịch sinh thái Ông Đề tại Phong Điền, Cần Thơ mang đến trải nghiệm miệt vườn, trò chơi dân gian, ẩm thực miền Tây và các hoạt động tập thể gần gũi thiên nhiên.</p>', latitude: 9.990583, longitude: 105.709202 },
  7: { name: 'Trường Đại học FPT Cần Thơ', description: '<p>Trường Đại học FPT Cần Thơ tọa lạc tại số 600 Nguyễn Văn Cừ nối dài. Khuôn viên nổi bật với kiến trúc hiện đại, không gian xanh và môi trường học tập gắn với công nghệ, quốc tế hóa và khởi nghiệp.</p>', latitude: 10.01349, longitude: 105.731715 },
  8: { name: 'Dinh Độc Lập – Không gian trưng bày', description: '<p>Không gian trưng bày tại Dinh Độc Lập giúp du khách tìm hiểu sâu hơn về lịch sử, kiến trúc và những sự kiện quan trọng diễn ra tại công trình này.</p>', latitude: 10.777035, longitude: 106.695523 },
};

const locations = {
  1: { name: 'Cổng chính Dinh Độc Lập', description: 'Lối vào chính trên đường Nam Kỳ Khởi Nghĩa, thuận tiện để bắt đầu hành trình tham quan Dinh Độc Lập.', latitude: 10.777931, longitude: 106.696295 },
  2: { name: 'Khuôn viên phía trước Dinh Độc Lập', description: 'Khuôn viên rộng, nhiều cây xanh và có góc nhìn đẹp về mặt tiền công trình.', latitude: 10.777, longitude: 106.695, thumbnail: null },
  3: { name: 'Cổng Bến Nhà Rồng', description: 'Lối vào Bảo tàng Hồ Chí Minh – Chi nhánh Thành phố Hồ Chí Minh, nhìn ra khu vực sông Sài Gòn.', latitude: 10.768081, longitude: 106.706139 },
  4: { name: 'Tòa nhà Gamma', description: 'Tòa Gamma thuộc khuôn viên Trường Đại học FPT Cần Thơ, phục vụ học tập, sự kiện và các hoạt động cộng đồng sinh viên.' },
  5: { name: 'Sân ngắm cảnh Bến Nhà Rồng', description: 'Không gian thoáng bên sông Sài Gòn, phù hợp ngắm cảnh, tìm hiểu kiến trúc và chụp ảnh lưu niệm.', latitude: 10.76835, longitude: 106.70642 },
  6: { name: 'Khu trưng bày ngoài trời', description: 'Khu vực giới thiệu kiến trúc và cảnh quan bên ngoài Bến Nhà Rồng.', latitude: 10.7685, longitude: 106.7062, thumbnail: null },
  7: { name: 'Khu giới thiệu Đại học FPT Cần Thơ', description: 'Không gian giới thiệu tổng quan về chương trình đào tạo, đời sống sinh viên và kiến trúc của campus Cần Thơ.' },
  8: { name: 'Tòa nhà Alpha – Đại học FPT Cần Thơ', description: 'Tòa Alpha là công trình học tập hiện đại với thiết kế lấy cảm hứng từ họa tiết Penrose, gồm hệ thống phòng học và không gian chức năng phục vụ sinh viên.' },
};

const tours = {
  1: { name: 'Dinh Độc Lập và Dấu Ấn Sài Gòn', slug: 'dinh-doc-lap-va-dau-an-sai-gon', description: 'Hành trình nửa ngày khám phá Dinh Độc Lập cùng những câu chuyện lịch sử và kiến trúc tiêu biểu của Sài Gòn.', short_description: 'Tour nửa ngày khám phá lịch sử và kiến trúc Dinh Độc Lập.', price: 690000, child_price: 450000, infant_price: 0, capacity: 25, schedule: '08:00 – 12:00', meeting_point: 'Cổng chính Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Quận 1', duration_days: 1, duration_nights: 0 },
  2: { name: 'Sài Gòn Xưa: Dinh Độc Lập và Bến Nhà Rồng', slug: 'sai-gon-xua-dinh-doc-lap-ben-nha-rong', description: 'Tour một ngày kết nối hai địa danh lịch sử nổi bật, kết hợp tham quan, nghe thuyết minh và trải nghiệm cảnh quan ven sông Sài Gòn.', short_description: 'Một ngày khám phá hai biểu tượng lịch sử của Thành phố Hồ Chí Minh.', price: 890000, child_price: 590000, infant_price: 0, capacity: 30, schedule: '08:00 – 17:00', meeting_point: 'Nhà Văn hóa Thanh Niên, Quận 1', duration_days: 1, duration_nights: 0 },
  3: { name: 'Ký Ức Sài Gòn', slug: 'ky-uc-sai-gon', description: 'Hành trình tham quan các dấu ấn lịch sử và không gian văn hóa đặc trưng của Sài Gòn.', short_description: 'Khám phá những câu chuyện và dấu ấn đáng nhớ của Sài Gòn.', price: 790000, child_price: 520000, infant_price: 0, capacity: 20, schedule: '08:30 – 16:30', meeting_point: 'Bưu điện Trung tâm Sài Gòn', duration_days: 1, duration_nights: 0 },
  4: { name: 'Miền Tây Xanh – Trải Nghiệm Ông Đề', slug: 'mien-tay-xanh-trai-nghiem-ong-de', description: 'Một ngày hòa mình vào không gian miệt vườn Cần Thơ, tham gia trò chơi dân gian và thưởng thức ẩm thực miền Tây.', short_description: 'Trải nghiệm sinh thái, trò chơi dân gian và ẩm thực Cần Thơ.', price: 1250000, child_price: 790000, infant_price: 0, capacity: 35, schedule: '07:30 – 17:30', meeting_point: 'Bến Ninh Kiều, Cần Thơ', duration_days: 1, duration_nights: 0 },
  5: { name: 'Về Miền Tây Tuổi Thơ', slug: 've-mien-tay-tuoi-tho', description: 'Chuyến đi dành cho gia đình với các hoạt động làm bánh dân gian, thăm vườn cây và vui chơi ngoài trời.', short_description: 'Tour gia đình trải nghiệm nét đẹp tuổi thơ miền sông nước.', price: 1090000, child_price: 690000, infant_price: 0, capacity: 28, schedule: '08:00 – 17:00', meeting_point: 'Trung tâm thành phố Cần Thơ', duration_days: 1, duration_nights: 0 },
  6: { name: 'Khám Phá Campus FPT Cần Thơ', slug: 'kham-pha-campus-fpt-can-tho', description: 'Tham quan kiến trúc nổi bật, không gian học tập và đời sống sinh viên tại Trường Đại học FPT Cần Thơ.', short_description: 'Khám phá kiến trúc và môi trường học tập tại FPT Cần Thơ.', price: 350000, child_price: 250000, infant_price: 0, capacity: 30, schedule: '08:30 – 11:30', meeting_point: 'Cổng Trường Đại học FPT Cần Thơ', duration_days: 1, duration_nights: 0 },
};

const reviews = {
  1: { comment: 'Không gian trang trọng, nhiều tư liệu lịch sử và rất đáng dành thời gian tham quan.', rating: 5 },
  2: { comment: 'Khung cảnh bên sông thoáng mát, phù hợp để tham quan và chụp ảnh vào buổi chiều.', rating: 4 },
  3: { comment: 'Khuôn viên hiện đại, sạch sẽ và có nhiều góc kiến trúc đẹp.', rating: 4 },
  4: { comment: 'Phần giới thiệu campus khá đầy đủ, nhân viên hỗ trợ nhiệt tình.', rating: 4 },
  5: { comment: 'Không gian rộng rãi, dễ tham quan và có nhiều thông tin hữu ích cho học sinh.', rating: 4 },
  6: { comment: 'Lịch trình hợp lý, hướng dẫn viên thân thiện và giới thiệu rất dễ hiểu.', rating: 5 },
  7: { comment: 'Tour tổ chức chu đáo, điểm tham quan thú vị và đúng với mô tả.', rating: 5, status: 'rejected' },
  8: { comment: 'Tòa nhà hiện đại, sạch sẽ và không gian học tập rất thoáng.', rating: 5 },
  9: { comment: 'Chuyến đi nhiều thông tin bổ ích, thời gian di chuyển được sắp xếp hợp lý.', rating: 5 },
  10: { comment: 'Trải nghiệm miền Tây vui, đồ ăn ngon và các hoạt động rất phù hợp nhóm bạn.', rating: 5 },
};

const posts = [
  'Buổi sáng ở Dinh Độc Lập rất dễ chịu. Nên đến sớm để có thời gian xem kỹ khu trưng bày và hầm chỉ huy.',
  'Vừa ghé Dinh Độc Lập, mình ấn tượng nhất với kiến trúc và những câu chuyện lịch sử được giữ gìn rất tốt.',
  'Gợi ý nhỏ: hãy dành ít nhất hai giờ cho Dinh Độc Lập và mang theo nước uống nếu tham quan vào buổi trưa.',
  'Một ngày khám phá Sài Gòn với Dinh Độc Lập và Bến Nhà Rồng, lịch trình vừa đủ và có nhiều góc chụp đẹp.',
  'Không gian sinh thái ở Ông Đề xanh mát, các trò chơi dân gian rất vui khi đi cùng nhóm bạn.',
  'Cuối tuần mình chọn đi dạo quanh trung tâm Cần Thơ, thưởng thức món địa phương và ngắm thành phố về đêm.',
  'Bến Nhà Rồng có kiến trúc đẹp và nhiều tư liệu lịch sử đáng xem. Khu vực ven sông cũng rất thoáng.',
  'Một buổi tham quan FPT Cần Thơ đầy năng lượng, khuôn viên rộng và kiến trúc các tòa nhà rất ấn tượng.',
  'Nếu đến Cần Thơ, bạn nên thử dậy sớm đi chợ nổi rồi ghé một khu sinh thái vào buổi chiều.',
  'Chuyến đi tháng 7 của mình có thời tiết khá đẹp, di chuyển thuận lợi và nhiều trải nghiệm đáng nhớ.',
  'Tòa Alpha tại FPT Cần Thơ có thiết kế độc đáo, nhiều ánh sáng tự nhiên và không gian học tập hiện đại.',
  'Ẩm thực miền Tây thật sự hấp dẫn; mình thích nhất các món dân dã được phục vụ ngay trong khu vườn.',
  'Lưu lại vài khoảnh khắc đẹp trong chuyến đi Cần Thơ. Nhất định mình sẽ quay lại vào mùa hè sau.',
];

const comments = [
  'Địa điểm này rất phù hợp cho một chuyến đi cuối tuần.', 'Cảm ơn bạn đã chia sẻ, mình sẽ lưu lại cho lịch trình sắp tới.',
  'Ảnh và trải nghiệm đều rất thú vị.', 'Mình cũng muốn ghé nơi này vào dịp gần nhất.', 'Thông tin hữu ích quá, cảm ơn bạn nhé!',
  'Đi vào buổi sáng sẽ mát và ít đông hơn.', 'Mình đã lưu địa điểm này rồi.', 'Khung cảnh đẹp và có nhiều góc chụp ảnh.',
  'Chuyến đi nghe hấp dẫn thật đấy!', 'Bạn có thể chia sẻ thêm kinh nghiệm di chuyển không?', 'Mình rất thích những địa điểm có giá trị lịch sử.',
  'Cuối tuần này mình cũng đang lên kế hoạch ghé thăm.', 'Cảm ơn gợi ý rất chi tiết của bạn.', 'Đi theo nhóm chắc sẽ vui lắm.',
  'Mình thích nhất không gian xanh ở đây.', 'Đồ ăn địa phương có món nào nên thử vậy bạn?', 'Lịch trình này khá hợp lý và dễ áp dụng.',
  'Mình từng đến đây và cũng có trải nghiệm rất tốt.', 'Nhìn thôi đã muốn xách ba lô lên đường rồi.', 'Bài chia sẻ rất gần gũi và hữu ích.',
  'Campus có kiến trúc thật ấn tượng.', 'Mình đồng ý, buổi chiều ở đây rất đẹp.', 'Cảm ơn bạn, mình sẽ thử theo gợi ý này.',
  'Trải nghiệm tuyệt vời cho nhóm bạn.', 'Có dịp mình sẽ quay lại lần nữa.', 'Không gian sạch sẽ và khá yên bình.',
  'Một địa điểm đáng thêm vào danh sách.', 'Ảnh đẹp quá, ánh sáng rất tự nhiên.', 'Mình cũng rất thích trải nghiệm này.',
];

const groups = {
  1: { name: 'Khám Phá Dấu Ấn Sài Gòn', description: 'Nhóm cùng tham quan các địa danh lịch sử tiêu biểu tại trung tâm Thành phố Hồ Chí Minh.', max_members: 20 },
  2: { name: 'Cuối Tuần Ở Cần Thơ', description: 'Chuyến đi ngắn ngày khám phá cảnh quan, ẩm thực và nhịp sống Cần Thơ.', max_members: 6 },
  4: { name: 'Hành Trình Bến Nhà Rồng', description: 'Cùng tìm hiểu lịch sử và ngắm cảnh ven sông Sài Gòn.', max_members: 12 },
  5: { name: 'Cần Thơ Xanh', description: 'Nhóm trải nghiệm du lịch sinh thái và ẩm thực miệt vườn Cần Thơ.', max_members: 8 },
  6: { name: 'Kết Nối Sinh Viên FPT', description: 'Nhóm riêng dành cho sinh viên cùng tham quan và tổ chức hoạt động tại campus.', max_members: 10 },
  7: { name: 'Một Ngày Ở Campus FPT', description: 'Tham quan các tòa nhà nổi bật và tìm hiểu đời sống sinh viên FPT Cần Thơ.', max_members: 10 },
  8: { name: 'Team Building Miền Tây', description: 'Lên kế hoạch hoạt động nhóm kết hợp vui chơi sinh thái tại Cần Thơ.', max_members: 30 },
  9: { name: 'Khám Phá FPT Cần Thơ', description: 'Nhóm mở dành cho người muốn tham quan kiến trúc và môi trường học tập tại FPT Cần Thơ.', max_members: 30 },
  10: { name: 'Sài Gòn Lịch Sử', description: 'Cùng tham quan Dinh Độc Lập và các địa danh lịch sử lân cận.', max_members: 25 },
  11: { name: 'Campus Tour FPT', description: 'Hẹn nhóm tham quan campus và giao lưu cùng sinh viên FPT Cần Thơ.', max_members: 20 },
};

async function run() {
  const client = await db.getClient();
  const changed = {};
  try {
    await client.query('BEGIN');

    changed.destination_categories = (await client.query(`UPDATE destination_category SET description = CASE destination_category_id WHEN 1 THEN 'Các địa danh, công trình và không gian gắn với lịch sử, văn hóa Việt Nam.' WHEN 4 THEN 'Điểm đến gần gũi thiên nhiên, phù hợp nghỉ dưỡng và trải nghiệm sinh thái.' ELSE description END WHERE destination_category_id IN (1,4)`)).rowCount;
    changed.tour_categories = (await client.query(`UPDATE tour_category SET name = CASE tour_category_id WHEN 4 THEN 'Gia đình' WHEN 6 THEN 'Cặp đôi' ELSE name END, description = CASE tour_category_id WHEN 4 THEN 'Tour có lịch trình nhẹ nhàng, phù hợp cho gia đình và trẻ em.' WHEN 6 THEN 'Hành trình riêng tư, lãng mạn dành cho hai người.' ELSE description END WHERE tour_category_id IN (4,6)`)).rowCount;
    changed.blog_categories = (await client.query(`UPDATE blog_category SET description = CASE blog_category_id WHEN 1 THEN 'Thông tin ưu đãi, chương trình khuyến mãi và kinh nghiệm săn deal du lịch.' WHEN 2 THEN 'Tin tức, xu hướng và cập nhật mới về điểm đến, trải nghiệm du lịch.' ELSE description END WHERE blog_category_id IN (1,2)`)).rowCount;
    changed.destinations = await updateMany(client, 'travel_destination', 'destination_id', destinations);
    changed.locations = await updateMany(client, 'location', 'location_id', locations);
    changed.tours = await updateMany(client, 'tour', 'tour_id', tours);

    changed.users = (await client.query(`UPDATE users SET
      name = CASE user_id
        WHEN 1 THEN 'Nguyễn Văn Hoài' WHEN 2 THEN 'Quản trị viên TravelLens' WHEN 3 THEN 'Nguyễn Văn An'
        WHEN 4 THEN 'Nguyễn Chí Dương' WHEN 5 THEN 'Nguyễn Văn Hoài' WHEN 9 THEN 'Nguyễn Trường'
        WHEN 10 THEN 'Đoàn Thị Yến Nhi' WHEN 11 THEN 'Đặng Khoa' WHEN 51 THEN 'Phạm Văn Hoài'
        WHEN 52 THEN 'Nhân viên TravelLens' WHEN 55 THEN 'Lê Đăng Khoa' WHEN 58 THEN 'Phạm Văn Hoài'
        WHEN 59 THEN 'Lê Thịnh' WHEN 60 THEN 'Phạm Văn Hoài' WHEN 62 THEN 'Nguyễn Thị Ngọc Hoa'
        WHEN 63 THEN 'Phạm Văn Hoài' ELSE name END,
      profile_info = CASE WHEN NULLIF(BTRIM(profile_info),'') IS NULL OR profile_info IN ('Travel lover from Da Nang','Loves beaches and mountain trips') THEN 'Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.' ELSE profile_info END,
      address = NULLIF(BTRIM(address), ''), phone = NULLIF(BTRIM(phone), ''), gender = NULLIF(BTRIM(gender), '')
    `)).rowCount;

    const blogData = {
      2: ['Một Ngày Khám Phá FPT University Cần Thơ', 'mot-ngay-kham-pha-fpt-university-can-tho', '<p>Nếu có dịp đến Cần Thơ, bạn có thể dành một buổi tham quan khuôn viên Trường Đại học FPT. Tòa Alpha và Gamma nổi bật với kiến trúc hiện đại, nhiều mảng xanh và không gian mở.</p><h2>Lịch trình gợi ý</h2><p>Bắt đầu từ khu giới thiệu, tiếp tục tham quan các tòa nhà học tập và dành thời gian trò chuyện cùng sinh viên để hiểu hơn về đời sống tại campus.</p>'],
      3: ['Những Góc Check-in Đẹp Tại FPT Cần Thơ', 'nhung-goc-check-in-dep-tai-fpt-can-tho', '<p>FPT Cần Thơ có nhiều góc kiến trúc hiện đại, đặc biệt tại tòa Alpha và các khoảng sân xanh giữa campus.</p><p>Nên ghé vào buổi sáng hoặc cuối chiều để có ánh sáng đẹp và thời tiết dễ chịu.</p>'],
      5: ['Bình Minh Trên Chợ Nổi Cái Răng', 'binh-minh-tren-cho-noi-cai-rang', '<p>Chợ nổi Cái Răng nhộn nhịp nhất từ sáng sớm. Khi mặt trời vừa lên, những chiếc ghe chở đầy trái cây và nông sản tạo nên khung cảnh sông nước rất đặc trưng.</p><h2>Kinh nghiệm</h2><p>Hãy xuất phát trước 6 giờ, mặc áo phao và chọn đơn vị vận chuyển uy tín. Đừng quên thử cà phê hoặc bún riêu được phục vụ ngay trên ghe.</p>'],
      6: ['Một Buổi Chiều Yên Bình Tại Bến Ninh Kiều', 'mot-buoi-chieu-yen-binh-tai-ben-ninh-kieu', '<p>Bến Ninh Kiều là biểu tượng quen thuộc của Cần Thơ. Buổi chiều, không khí mát hơn và ánh hoàng hôn phủ lên dòng Hậu Giang tạo nên khung cảnh rất thư thái.</p><p>Bạn có thể đi bộ dọc công viên, ghé chợ đêm và thưởng thức các món ăn địa phương.</p>'],
      9: ['Bến Ninh Kiều – Biểu Tượng Của Cần Thơ', 'ben-ninh-kieu-bieu-tuong-cua-can-tho', '<p>Nằm bên dòng Hậu Giang, Bến Ninh Kiều là nơi lý tưởng để cảm nhận nhịp sống Cần Thơ. Khu vực này có công viên, cầu đi bộ, chợ đêm và nhiều nhà hàng phục vụ đặc sản miền Tây.</p><p>Thời điểm đẹp nhất để ghé thăm là cuối buổi chiều và buổi tối.</p>'],
      10: ['Hòn Sơn – Viên Ngọc Xanh Của Kiên Giang', 'hon-son-vien-ngoc-xanh-kien-giang', '<p>Hòn Sơn hấp dẫn bởi nước biển trong, những rặng dừa ven bờ và nhịp sống làng chài bình dị. Du khách có thể tắm biển, trekking Ma Thiên Lãnh và thưởng thức hải sản tươi.</p><p>Nên kiểm tra thời tiết trước chuyến đi và đặt vé tàu sớm vào cuối tuần.</p>'],
      11: ['Hành Trình Khám Phá Miền Tây Bằng Phương Tiện Công Cộng', 'hanh-trinh-kham-pha-mien-tay-bang-phuong-tien-cong-cong', '<p>Di chuyển bằng xe buýt và xe khách giúp chuyến đi miền Tây tiết kiệm hơn, đồng thời mang đến cơ hội quan sát nhịp sống địa phương.</p><p>Hãy chuẩn bị lịch trình linh hoạt, kiểm tra giờ chạy và ưu tiên hành lý gọn nhẹ.</p>'],
    };
    changed.blogs = 0;
    for (const [id, [title, slug, content]] of Object.entries(blogData)) changed.blogs += await updateById(client, 'blog', 'blog_id', Number(id), { title, slug, content });

    changed.reviews = await updateMany(client, 'review', 'review_id', reviews);
    changed.posts = 0;
    for (let i = 0; i < posts.length; i += 1) changed.posts += await updateById(client, 'travel_post', 'post_id', i + 1, { content: posts[i] });
    const commentRows = (await client.query('SELECT comment_id FROM travel_post_comment ORDER BY comment_id')).rows;
    changed.post_comments = 0;
    for (let i = 0; i < commentRows.length; i += 1) changed.post_comments += await updateById(client, 'travel_post_comment', 'comment_id', commentRows[i].comment_id, { content: comments[i % comments.length] });
    changed.groups = await updateMany(client, 'group_trip', 'group_trip_id', groups);
    changed.group_destinations = (await client.query(`UPDATE group_trip g SET destination_name = d.name FROM travel_destination d WHERE g.destination_id=d.destination_id`)).rowCount;

    // Reprice passenger lines from the normalized tour tariff, then synchronize booking totals.
    changed.booking_details = (await client.query(`UPDATE booking_detail bd SET price = CASE bd.age_category WHEN 'child' THEN t.child_price WHEN 'infant' THEN t.infant_price ELSE t.price END FROM booking b JOIN tour t ON t.tour_id=b.tour_id WHERE bd.booking_id=b.booking_id`)).rowCount;
    changed.bookings = (await client.query(`WITH totals AS (
      SELECT b.booking_id, COALESCE(SUM(bd.price), t.price) original,
        LEAST(COALESCE(b.discount_amount,0), ROUND(COALESCE(SUM(bd.price),t.price)*0.20)) discount
      FROM booking b JOIN tour t ON t.tour_id=b.tour_id LEFT JOIN booking_detail bd ON bd.booking_id=b.booking_id
      GROUP BY b.booking_id,t.price,b.discount_amount
    ) UPDATE booking b SET original_amount=x.original, discount_amount=x.discount,
      final_amount=GREATEST(x.original-x.discount,0), currency='VND' FROM totals x WHERE b.booking_id=x.booking_id`)).rowCount;
    changed.payments = (await client.query(`UPDATE payment p SET amount=b.final_amount,currency='VND' FROM booking b WHERE p.booking_id=b.booking_id`)).rowCount;

    // Correct derived counters instead of keeping manually entered values.
    await client.query(`UPDATE travel_post p SET like_count=(SELECT count(*) FROM travel_post_like l WHERE l.post_id=p.post_id), comment_count=(SELECT count(*) FROM travel_post_comment c WHERE c.post_id=p.post_id AND c.status='published'), share_count=(SELECT count(*) FROM travel_post_share s WHERE s.post_id=p.post_id AND s.counted=true), report_count=(SELECT count(*) FROM travel_post_report r WHERE r.post_id=p.post_id)`);

    const invalid = await client.query(`SELECT
      (SELECT count(*) FROM booking WHERE original_amount < discount_amount OR final_amount <> original_amount-discount_amount) bad_bookings,
      (SELECT count(*) FROM payment p JOIN booking b USING(booking_id) WHERE p.amount<>b.final_amount) bad_payments,
      (SELECT count(*) FROM tour WHERE currency<>'VND' OR price<=0 OR capacity<=0) bad_tours`);
    if (Object.values(invalid.rows[0]).some(Number)) throw new Error(`Validation failed: ${JSON.stringify(invalid.rows[0])}`);

    await client.query('COMMIT');
    console.log(JSON.stringify({ success: true, changed, validation: invalid.rows[0] }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
