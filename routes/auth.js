const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // You'll need to create this
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile); // Add this route for profile updates

module.exports = router;