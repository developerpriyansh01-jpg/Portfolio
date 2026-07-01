const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getPaginationQuery, getPagination } = require('../utils/helpers');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = { status: 'approved' };
    if (req.query.featured === 'true') filter.isFeatured = true;

    const [reviews, total, ratingData] = await Promise.all([
      Review.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(filter),
      Review.getAverageRating(),
    ]);

    return res.json({
      success: true,
      message: 'Reviews fetched',
      data: reviews,
      averageRating: parseFloat(ratingData.avgRating?.toFixed(1)) || 0,
      totalReviews: ratingData.count,
      pagination: getPagination(page, limit, total),
    });
  } catch (error) { next(error); }
};

// @desc    Submit review (public)
// @route   POST /api/reviews
// @access  Public
exports.submitReview = async (req, res, next) => {
  try {
    const reviewData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.REVIEWS);
      reviewData.avatar = { url: result.url, publicId: result.publicId };
    }
    const review = await Review.create(reviewData);
    return successResponse(res, 'Review submitted successfully! It will appear after admin approval.', review, 201);
  } catch (error) { next(error); }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } },
      { message: { $regex: req.query.search, $options: 'i' } },
    ];

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(filter),
    ]);
    return res.json({ success: true, data: reviews, pagination: getPagination(page, limit, total) });
  } catch (error) { next(error); }
};

// @desc    Approve review
// @route   PATCH /api/reviews/:id/approve
// @access  Private
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedAt: new Date(), reviewedBy: req.user._id },
      { new: true }
    );
    if (!review) return errorResponse(res, 'Review not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'approve', module: 'reviews', description: `Review approved: ${review.name}`, targetId: review._id.toString(), targetTitle: review.name, status: 'success' });
    return successResponse(res, 'Review approved', review);
  } catch (error) { next(error); }
};

// @desc    Reject review
// @route   PATCH /api/reviews/:id/reject
// @access  Private
exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedAt: new Date(), reviewedBy: req.user._id, adminNote: req.body.adminNote || '' },
      { new: true }
    );
    if (!review) return errorResponse(res, 'Review not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'reject', module: 'reviews', description: `Review rejected: ${review.name}`, status: 'success' });
    return successResponse(res, 'Review rejected', review);
  } catch (error) { next(error); }
};

// @desc    Toggle featured
// @route   PATCH /api/reviews/:id/feature
// @access  Private
exports.featureReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 'Review not found', 404);
    review.isFeatured = !review.isFeatured;
    await review.save();
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'feature', module: 'reviews', description: `Review ${review.isFeatured ? 'featured' : 'unfeatured'}: ${review.name}`, status: 'success' });
    return successResponse(res, `Review ${review.isFeatured ? 'featured' : 'unfeatured'}`, review);
  } catch (error) { next(error); }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) return errorResponse(res, 'Review not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'update', module: 'reviews', description: `Review updated: ${review.name}`, status: 'success' });
    return successResponse(res, 'Review updated', review);
  } catch (error) { next(error); }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return errorResponse(res, 'Review not found', 404);
    if (review.avatar?.publicId) await deleteFromCloudinary(review.avatar.publicId);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'delete', module: 'reviews', description: `Review deleted: ${review.name}`, status: 'success' });
    return successResponse(res, 'Review deleted');
  } catch (error) { next(error); }
};
