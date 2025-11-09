const express = require('express');
const { 
  register, 
  login, 
  updateProfile,  // Make sure this is imported
  getProfile      // Add this new function
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.use(protect); // All routes below this will require authentication

router.route('/profile')
  .get(getProfile)     // Add GET route for profile
  .put(updateProfile); // Add PUT route for profile updates

module.exports = router;