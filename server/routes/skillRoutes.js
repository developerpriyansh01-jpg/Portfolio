const express = require('express');
const router = express.Router();
const { getSkills, getAllSkills, createSkill, updateSkill, deleteSkill, reorderSkills } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', getSkills);
router.get('/all', protect, getAllSkills);
router.put('/reorder', protect, reorderSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
