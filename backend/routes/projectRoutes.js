const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  addTimelineEvent,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize(['Client', 'Admin']), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize(['Client', 'Admin', 'Vendor']), updateProject)
  .delete(protect, authorize(['Admin']), deleteProject);

router.route('/:id/timeline')
  .post(protect, authorize(['Client', 'Admin', 'Vendor']), addTimelineEvent); // Client for request events, Admin/Vendor for progress

module.exports = router;