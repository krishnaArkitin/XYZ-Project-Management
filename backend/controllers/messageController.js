const Conversation = require('../models/Conversation');
const Project = require('../models/Project'); // To verify project ownership

// @desc    Get all conversations for the authenticated user
// @route   GET /api/conversations
// @access  Private
const getMyConversations = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('projectId', 'title') // Populate project title
    .populate('participants', 'name avatarUrl'); // Populate participant names and avatars
  res.json(conversations);
};

// @desc    Get messages for a specific conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
const getConversationMessages = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate({
      path: 'messages.sender',
      select: 'name avatarUrl', // Populate sender details for each message
    });

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  // Check if the authenticated user is a participant
  if (!conversation.participants.some(p => p.equals(req.user._id))) {
    return res.status(403).json({ message: 'Not authorized to view this conversation' });
  }

  res.json(conversation.messages);
};

// @desc    Send a message in a conversation
// @route   POST /api/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { text } = req.body;
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  // Check if the authenticated user is a participant
  if (!conversation.participants.some(p => p.equals(req.user._id))) {
    return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
  }

  const message = {
    sender: req.user._id,
    text,
    timestamp: new Date(),
  };

  conversation.messages.push(message);
  await conversation.save();

  // Return the newly added message (with sender populated)
  const populatedMessage = conversation.messages[conversation.messages.length - 1];
  populatedMessage.sender = { _id: req.user._id, name: req.user.name, avatarUrl: req.user.avatarUrl }; // Manually populate for immediate response

  res.status(201).json(populatedMessage);
};

// @desc    Create a new conversation (e.g., when a project is created)
// @route   POST /api/conversations
// @access  Private/Admin, Client
const createConversation = async (req, res) => {
  const { projectId, participantIds } = req.body; // participantIds should be an array of user IDs

  if (!projectId || !participantIds || !Array.isArray(participantIds)) {
    return res.status(400).json({ message: 'Project ID and participant IDs are required' });
  }

  // Ensure the current user is included in participants or is an Admin
  if (!participantIds.includes(req.user._id.toString()) && req.user.role !== 'Admin') {
      participantIds.push(req.user._id.toString());
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if a conversation already exists for this project
  const existingConversation = await Conversation.findOne({ projectId });
  if (existingConversation) {
      return res.status(400).json({ message: 'Conversation already exists for this project', conversation: existingConversation });
  }

  const conversation = new Conversation({
    projectId,
    participants: [...new Set(participantIds)], // Ensure unique participants
    messages: [],
  });

  const createdConversation = await conversation.save();
  res.status(201).json(createdConversation);
};


module.exports = {
  getMyConversations,
  getConversationMessages,
  sendMessage,
  createConversation,
};