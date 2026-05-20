const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Travel360 API is healthy' });
});

router.use('/auth', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/categories', require('./category.route'));
router.use('/tours', require('./tour.route'));
router.use('/travel-destinations', require('./travelDestination.route'));
router.use('/locations', require('./location.route'));
router.use('/view360', require('./view360.route'));
router.use('/view360-images', require('./view360Image.route'));
router.use('/maps', require('./map.route'));
router.use('/bookings', require('./booking.route'));
router.use('/booking-details', require('./bookingDetail.route'));
router.use('/payments', require('./payment.route'));
router.use('/coupons', require('./coupon.route'));
router.use('/blogs', require('./blog.route'));
router.use('/blog-locations', require('./blogLocation.route'));
router.use('/reviews', require('./review.route'));
router.use('/statistics', require('./statistics.route'));
router.use('/chat', require('./chat.route'));
router.use('/suggestions', require('./suggestion.route'));

module.exports = router;
