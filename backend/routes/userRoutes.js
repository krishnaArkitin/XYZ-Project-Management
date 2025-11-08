const express = require('express');
const { getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize(['Admin']), getUsers); // Only Admin can view all users

router.route('/:id')
  .get(protect, authorize(['Admin']), getUserById); // Only Admin can view any user by ID

module.exports = router;