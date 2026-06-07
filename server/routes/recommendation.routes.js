const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { optionalAuth } = require('../middleware/auth');

router.get('/hot', recommendationController.getHotRecommendations);
router.get('/good', recommendationController.getGoodRecommendations);
router.get('/value', recommendationController.getValueRecommendations);
router.get('/personal', optionalAuth, recommendationController.getPersonalRecommendations);

module.exports = router;
