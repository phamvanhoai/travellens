const express = require('express');
const router = express.Router();
const aiRecommendationController = require('../controllers/aiRecommendation.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');

// Public endpoints
router.post('/parse-request', aiRecommendationController.parseTravelRequest);
router.post('/recommend', aiRecommendationController.recommendDestinations);

// Search: authenticate so it auto-saves history when user is logged in and requires login
router.post('/search', authenticate, aiRecommendationController.searchByText);

// History endpoints (auth required)
router.get('/history', authenticate, aiRecommendationController.getHistory);
router.delete('/history/:id', authenticate, aiRecommendationController.deleteHistory);

module.exports = router;
