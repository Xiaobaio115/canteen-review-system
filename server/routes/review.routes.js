const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { auth } = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, role('student'), reviewController.create);
router.get('/restaurant/:restaurantId', reviewController.getRestaurantReviews);
router.get('/my', auth, role('student'), reviewController.getMyReviews);

module.exports = router;
