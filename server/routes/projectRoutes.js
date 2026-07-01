const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, getAllProjects, createProject, updateProject, deleteProject, deleteScreenshot
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { uploadScreenshots } = require('../middleware/upload');

// Multi-field upload: thumbnail (1) + screenshots (up to 8)
const projectUpload = uploadScreenshots.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'screenshots', maxCount: 8 },
]);

router.get('/', getProjects);
router.get('/admin/all', protect, getAllProjects);
router.get('/:slug', getProject);
router.post('/', protect, projectUpload, createProject);
router.put('/:id', protect, projectUpload, updateProject);
router.delete('/:id', protect, deleteProject);
router.delete('/:id/screenshots/:publicId', protect, deleteScreenshot);

module.exports = router;
