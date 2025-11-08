const express = require('express');
const {
  getMyMeetings,
  scheduleMeeting,
  updateMeetingStatus,
  deleteMeeting,
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMyMeetings)
  .post(protect, scheduleMeeting);

router.route('/:id')
  .put(protect, updateMeetingStatus)
  .delete(protect, authorize(['Admin']), deleteMeeting); // Only admins or meeting creator can delete

module.exports = router;