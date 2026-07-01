const express = require('express');
const router = express.Router();
const { submitContact, getContacts, getContact, updateStatus, deleteContact, getUnreadCount } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { uploadDoc } = require('../middleware/upload');
const { submissionLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/', submissionLimiter, uploadDoc.single('attachment'), [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('subject').notEmpty().withMessage('Subject required'),
  body('message').notEmpty().isLength({ max: 2000 }).withMessage('Message required (max 2000 chars)'),
], validate, submitContact);

router.get('/unread-count', protect, getUnreadCount);
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteContact);

module.exports = router;
