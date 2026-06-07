const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const restaurantRoutes = require('./restaurant.routes');
const reviewRoutes = require('./review.routes');
const recommendationRoutes = require('./recommendation.routes');
const merchantRoutes = require('./merchant.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/reviews', reviewRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/merchant', merchantRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
