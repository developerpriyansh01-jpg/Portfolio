const express = require('express');
const router = express.Router();
const { submitHireRequest, getHireRequests, getHireRequest, updateStatus, deleteHireRequest } = require('../controllers/hireController');
const { protect } = require('../middleware/auth');
const { submissionLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/', submissionLimiter, [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').notEmpty().withMessage('Message required'),
  body('projectType').notEmpty().withMessage('Project type required'),
], validate, submitHireRequest);

router.get('/', protect, getHireRequests);
router.get('/:id', protect, getHireRequest);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteHireRequest);

module.exports = router;
