const express = require('express');
const router = express.Router();
const { getExperiences, getAllExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');

router.get('/', getExperiences);
router.get('/all', protect, getAllExperiences);
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
