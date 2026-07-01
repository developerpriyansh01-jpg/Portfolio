const express = require('express');
const router = express.Router();
const {
  getReviews, submitReview, getAllReviews, approveReview, rejectReview, featureReview, updateReview, deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { submissionLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/', getReviews);
router.post('/', submissionLimiter, uploadImage.single('avatar'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('message').notEmpty().isLength({ max: 1000 }).withMessage('Message required (max 1000 chars)'),
], validate, submitReview);

router.get('/admin/all', protect, getAllReviews);
router.patch('/:id/approve', protect, approveReview);
router.patch('/:id/reject', protect, rejectReview);
router.patch('/:id/feature', protect, featureReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
