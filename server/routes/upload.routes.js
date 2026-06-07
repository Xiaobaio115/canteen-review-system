const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/upload.controller');
const { uploadRestaurantImage } = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/restaurant', auth, role('merchant', 'admin'), uploadRestaurantImage, uploadImage);

module.exports = router;
