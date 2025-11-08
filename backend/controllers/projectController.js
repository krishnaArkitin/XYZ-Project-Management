const Project = require('../models/Project');
const User = require('../models/User'); // Needed to populate client/vendor details

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  const { user } = req;
  let projects;

  if (user.role === 'Admin') {
    projects = await Project.find({})
      .populate('clientId', 'name email avatarUrl')
      .populate('vendorId', 'name email avatarUrl');
  } else if (user.role === 'Client') {
    projects = await Project.find({ clientId: user._id })
      .populate('clientId', 'name email avatarUrl')
      .populate('vendorId', 'name email avatarUrl');
  } else if (user.role === 'Vendor') {
    projects = await Project.find({ vendorId: user._id })
      .populate('clientId', 'name email avatarUrl')
      .populate('vendorId', 'name email avatarUrl');
  } else {
    return res.status(403).json({ message: 'Not authorized to view projects' });
  }

  res.json(projects);
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('clientId', 'name email avatarUrl')
    .populate('vendorId', 'name email avatarUrl');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Authorization check
  const { user } = req;
  const isAuthorized = user.role === 'Admin' ||
                       project.clientId.equals(user._id) ||
                       (project.vendorId && project.vendorId.equals(user._id));

  if (!isAuthorized) {
    return res.status(403).json({ message: 'Not authorized to view this project' });
  }

  res.json(project);
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Client, Admin
const createProject = async (req, res) => {
  const { title, category, description, budget, expectedTimeline, vendorId, files } = req.body;

  if (req.user.role === 'Vendor') {
    return res.status(403).json({ message: 'Vendors cannot create projects' });
  }

  const project = new Project({
    title,
    category,
    description,
    timeline: [{
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      title: 'Project Requested',
      description: 'Project request submitted by client/admin.',
      author: req.user.name,
    }],
    status: 'Requested',
    budget,
    clientId: req.user.role === 'Client' ? req.user._id : req.body.clientId, // If admin, client can be specified
    vendorId: vendorId || null,
    files: files || [],
    expectedTimeline,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Client, Admin, Vendor
const updateProject = async (req, res) => {
  const { title, category, description, timeline, status, budget, vendorId, files, expectedTimeline } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Authorization check for update
  const { user } = req;
  const isAuthorized = user.role === 'Admin' ||
                       (project.clientId.equals(user._id) && user.role === 'Client') ||
                       (project.vendorId && project.vendorId.equals(user._id) && user.role === 'Vendor');

  if (!isAuthorized) {
    return res.status(403).json({ message: 'Not authorized to update this project' });
  }

  // Allow updates based on role
  if (user.role === 'Client' && project.clientId.equals(user._id)) {
    // Clients can potentially update some details before approval
    project.title = title || project.title;
    project.category = category || project.category;
    project.description = description || project.description;
    project.budget = budget || project.budget;
    project.expectedTimeline = expectedTimeline || project.expectedTimeline;
    project.files = files || project.files;
    // Clients cannot change status directly beyond 'Requested' or 'Quotation'
  } else if (user.role === 'Vendor' && project.vendorId && project.vendorId.equals(user._id)) {
    // Vendors can update status if it's 'In Progress' and add timeline events
    project.status = status || project.status; // Only if appropriate transition
    // Vendors cannot change core project details or budget
  } else if (user.role === 'Admin') {
    // Admins can update anything
    project.title = title || project.title;
    project.category = category || project.category;
    project.description = description || project.description;
    project.timeline = timeline || project.timeline;
    project.status = status || project.status;
    project.budget = budget || project.budget;
    project.vendorId = vendorId || project.vendorId;
    project.files = files || project.files;
    project.expectedTimeline = expectedTimeline || project.expectedTimeline;
  } else {
      return res.status(403).json({ message: 'Your role does not permit this update' });
  }

  const updatedProject = await project.save();
  res.json(updatedProject);
};

// @desc    Add a timeline event to a project
// @route   POST /api/projects/:id/timeline
// @access  Private/Admin (or Vendor for progress updates)
const addTimelineEvent = async (req, res) => {
  const { title, description, date } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Authorization check for timeline update
  const { user } = req;
  const isAuthorized = user.role === 'Admin' ||
                       (project.vendorId && project.vendorId.equals(user._id) && user.role === 'Vendor') ||
                       (project.clientId.equals(user._id) && user.role === 'Client'); // Client might add initial request events

  if (!isAuthorized) {
    return res.status(403).json({ message: 'Not authorized to add timeline events to this project' });
  }

  const newEvent = {
    date: date || new Date().toISOString().split('T')[0],
    title,
    description,
    author: user.name,
  };

  project.timeline.push(newEvent);
  await project.save();
  res.status(201).json(project.timeline[project.timeline.length - 1]); // Return the newly added event
};


// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  await Project.deleteOne({ _id: project._id });
  res.json({ message: 'Project removed' });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  addTimelineEvent,
  deleteProject,
};