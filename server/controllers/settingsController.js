const Settings = require('../models/Settings');
const ActivityLog = require('../models/ActivityLog');
const { successResponse } = require('../utils/apiResponse');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return successResponse(res, 'Settings fetched', settings);
  } catch (error) { next(error); }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    const allowedFields = [
      'siteName', 'siteTagline', 'siteDescription', 'siteKeywords', 'siteVersion',
      'ogImage', 'canonicalUrl', 'googleVerification', 'googleAnalyticsId',
      'showReviews', 'showGithubStats', 'showCodingProfiles', 'showVisitorCount',
      'allowReviewSubmissions', 'maintenanceMode', 'maintenanceMessage',
      'primaryColor', 'accentColor', 'faq', 'codingProfiles', 'techStackItems',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) settings[field] = req.body[field];
    });

    await settings.save();

    await ActivityLog.create({
      user: req.user._id, userName: req.user.name,
      action: 'settings_change', module: 'settings',
      description: 'Site settings updated', status: 'success',
    });

    return successResponse(res, 'Settings updated', settings);
  } catch (error) { next(error); }
};

// @desc    Get activity logs (admin)
// @route   GET /api/settings/logs
// @access  Private
exports.getActivityLogs = async (req, res, next) => {
  try {
    const ActivityLog = require('../models/ActivityLog');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.module) filter.module = req.query.module;

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
      ActivityLog.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: logs,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total },
    });
  } catch (error) { next(error); }
};
