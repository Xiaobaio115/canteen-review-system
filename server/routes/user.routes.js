const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);

module.exports = router;
