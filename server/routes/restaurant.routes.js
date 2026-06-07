const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, restaurantController.getList);
router.get('/:id', optionalAuth, restaurantController.getDetail);

module.exports = router;
