const express = require('express');
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile); // Protected route to get current user's profile

module.exports = router;