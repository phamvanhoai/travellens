const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Travel360 API is healthy' });
});

router.use('/auth', require('./auth.route'));
router.use('/admin', require('./admin.route'));
router.use('/staff', require('./staff.route'));
router.use('/destination-categories', require('./destinationCategoryPublic.route'));
router.use('/tour-categories', require('./tourCategoryPublic.route'));
router.use('/blog-categories', require('./blogCategoryPublic.route'));
router.use('/tours', require('./tourPublic.route'));
router.use('/travel-destinations', require('./travelDestinationPublic.route'));
router.use('/locations', require('./locationPublic.route'));
router.use('/view360', require('./view360Public.route'));
router.use('/view360-images', require('./view360ImagePublic.route'));
router.use('/maps', require('./mapPublic.route'));
router.use('/navigation', require('./navigation.route'));
router.use('/bookings', require('./booking.route'));
router.use('/payments', require('./payment.route'));
router.use('/webhooks', require('./webhook.route'));
router.use('/coupons', require('./couponPublic.route'));
router.use('/blogs', require('./blogPublic.route'));
router.use('/reviews', require('./reviewPublic.route'));
router.use('/ai', require('./aiRecommendation.routes'));
router.use('/travel-feed', require('./travelFeed.route'));
router.use('/chat', require('./chat.route'));
router.use('/suggestions', require('./suggestion.route'));
router.use('/saved', require('./savedItem.route'));
router.use('/group-trips', require('./groupTrip.route'));
router.use('/group-trip-invites', require('./groupTripInvite.route'));

module.exports = router;
