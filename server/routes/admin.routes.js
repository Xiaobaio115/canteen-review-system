const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const restaurantController = require('../controllers/restaurant.controller');
const { auth } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/reviews/pending', auth, role('admin'), adminController.getPendingReviews);
router.put('/reviews/:reviewId/audit', auth, role('admin'), adminController.auditReview);
router.get('/statistics', auth, role('admin'), adminController.getStatistics);
router.get('/users', auth, role('admin'), adminController.getUsers);
router.put('/users/:userId/:action', auth, role('admin'), adminController.toggleUserStatus);
router.post('/restaurants', auth, role('admin'), restaurantController.create);
router.put('/restaurants/:id', auth, role('admin'), restaurantController.update);
router.delete('/restaurants/:id', auth, role('admin'), restaurantController.remove);

module.exports = router;
