const mongoose = require('mongoose');
const MessageSchema = require('./Message').schema; // Import schema directly

const ConversationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema], // Embed MessageSchema
}, {
  timestamps: true,
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;