const HireRequest = require('../models/HireRequest');
const { sendHireNotification } = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getPaginationQuery, getPagination, getClientIP } = require('../utils/helpers');

// @desc    Submit hire request (public)
// @route   POST /api/hire
// @access  Public
exports.submitHireRequest = async (req, res, next) => {
  try {
    const hireData = { ...req.body, ipAddress: getClientIP(req) };
    const hire = await HireRequest.create(hireData);
    // Non-blocking notification
    sendHireNotification(hire).catch(console.error);
    return successResponse(res, "Hire request submitted! I'll contact you within 24 hours.", { id: hire._id }, 201);
  } catch (error) { next(error); }
};

// @desc    Get all hire requests (admin)
// @route   GET /api/hire
// @access  Private
exports.getHireRequests = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.starred === 'true') filter.isStarred = true;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } },
    ];

    const [requests, total] = await Promise.all([
      HireRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      HireRequest.countDocuments(filter),
    ]);
    return res.json({ success: true, data: requests, pagination: getPagination(page, limit, total) });
  } catch (error) { next(error); }
};

// @desc    Get single hire request
// @route   GET /api/hire/:id
// @access  Private
exports.getHireRequest = async (req, res, next) => {
  try {
    const hire = await HireRequest.findById(req.params.id);
    if (!hire) return errorResponse(res, 'Hire request not found', 404);
    return successResponse(res, 'Hire request fetched', hire);
  } catch (error) { next(error); }
};

// @desc    Update hire request status
// @route   PATCH /api/hire/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const hire = await HireRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, isStarred: req.body.isStarred, adminNote: req.body.adminNote },
      { new: true }
    );
    if (!hire) return errorResponse(res, 'Hire request not found', 404);
    return successResponse(res, 'Status updated', hire);
  } catch (error) { next(error); }
};

// @desc    Delete hire request
// @route   DELETE /api/hire/:id
// @access  Private
exports.deleteHireRequest = async (req, res, next) => {
  try {
    const hire = await HireRequest.findByIdAndDelete(req.params.id);
    if (!hire) return errorResponse(res, 'Hire request not found', 404);
    return successResponse(res, 'Hire request deleted');
  } catch (error) { next(error); }
};
