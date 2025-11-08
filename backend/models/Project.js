const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true }, // Name of the user who made the update
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['IoT', 'Manufacturing', 'IT', 'Others'],
    required: true,
  },
  description: { type: String, required: true },
  timeline: [TimelineEventSchema],
  status: {
    type: String,
    enum: ['Requested', 'Quotation', 'Approved', 'In Progress', 'Completed', 'Rejected'],
    default: 'Requested',
  },
  budget: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  files: [{
    name: { type: String },
    url: { type: String },
  }],
  expectedTimeline: { type: String, required: true },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;