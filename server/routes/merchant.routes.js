const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant.controller');
const { auth } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/restaurants', auth, role('merchant'), merchantController.getMyRestaurants);
router.get('/restaurants/:restaurantId/reviews', auth, role('merchant'), merchantController.getRestaurantReviews);
router.post('/reviews/:reviewId/reply', auth, role('merchant'), merchantController.replyReview);
router.put('/restaurants/:id', auth, role('merchant'), merchantController.updateMyRestaurant);

module.exports = router;
