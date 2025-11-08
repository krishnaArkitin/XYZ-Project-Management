const Meeting = require('../models/Meeting');
const User = require('../models/User'); // To populate creator/participants

// @desc    Get all meetings for the authenticated user
// @route   GET /api/meetings
// @access  Private
const getMyMeetings = async (req, res) => {
  const meetings = await Meeting.find({ participants: req.user._id })
    .populate('creator', 'name avatarUrl')
    .populate('participants', 'name avatarUrl')
    .sort({ date: 1, time: 1 }); // Sort by date and time
  res.json(meetings);
};

// @desc    Schedule a new meeting
// @route   POST /api/meetings
// @access  Private
const scheduleMeeting = async (req, res) => {
  const { title, date, time, participantIds } = req.body;

  if (!title || !date || !time || !participantIds || !Array.isArray(participantIds)) {
    return res.status(400).json({ message: 'Please provide title, date, time, and participants' });
  }

  // Ensure the creator is also a participant
  if (!participantIds.includes(req.user._id.toString())) {
    participantIds.push(req.user._id.toString());
  }

  const meeting = new Meeting({
    title,
    date,
    time,
    participants: [...new Set(participantIds)], // Ensure unique participants
    creator: req.user._id,
    status: 'Pending', // Default status
  });

  const createdMeeting = await meeting.save();
  res.status(201).json(createdMeeting);
};

// @desc    Update meeting status (e.g., accept/decline/confirm)
// @route   PUT /api/meetings/:id
// @access  Private
const updateMeetingStatus = async (req, res) => {
  const { status } = req.body; // 'Confirmed', 'Cancelled'

  if (!status || !['Confirmed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  // Only participants or the creator can update status
  if (!meeting.participants.some(p => p.equals(req.user._id)) && !meeting.creator.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to update this meeting' });
  }

  meeting.status = status;
  const updatedMeeting = await meeting.save();
  res.json(updatedMeeting);
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
// @access  Private/Admin, Creator
const deleteMeeting = async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  // Only Admin or the creator can delete a meeting
  if (!req.user.role === 'Admin' && !meeting.creator.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this meeting' });
  }

  await Meeting.deleteOne({ _id: meeting._id });
  res.json({ message: 'Meeting removed' });
};

module.exports = {
  getMyMeetings,
  scheduleMeeting,
  updateMeetingStatus,
  deleteMeeting,
};