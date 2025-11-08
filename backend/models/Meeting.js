const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // Store as string for flexibility with frontend display
  time: { type: String, required: true }, // Store as string for flexibility
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting;