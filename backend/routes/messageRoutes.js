const express = require('express');
const {
  getMyConversations,
  getConversationMessages,
  sendMessage,
  createConversation,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMyConversations)
  .post(protect, authorize(['Client', 'Admin']), createConversation);

router.route('/:id/messages')
  .get(protect, getConversationMessages)
  .post(protect, sendMessage);

module.exports = router;