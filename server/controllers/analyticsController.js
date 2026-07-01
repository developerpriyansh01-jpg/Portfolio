const Analytics = require('../models/Analytics');
const Contact = require('../models/Contact');
const HireRequest = require('../models/HireRequest');
const Project = require('../models/Project');
const Review = require('../models/Review');
const { successResponse } = require('../utils/apiResponse');
const { getClientIP, detectDevice, detectBrowser } = require('../utils/helpers');

// Helper — get today's analytics document (upsert)
const getTodayAnalytics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Analytics.findOneAndUpdate(
    { date: today },
    { $setOnInsert: { date: today } },
    { new: true, upsert: true }
  );
};

// @desc    Track a visit (called automatically on page load)
// @route   POST /api/analytics/track
// @access  Public
exports.trackVisit = async (req, res, next) => {
  try {
    const { event = 'visit' } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);

    const update = { $inc: {} };

    switch (event) {
      case 'visit':
        update.$inc.totalVisits = 1;
        update.$inc[device] = 1;
        update.$inc[browser] = 1;
        break;
      case 'resume_download': update.$inc.resumeDownloads = 1; break;
      case 'github_click': update.$inc.githubClicks = 1; break;
      case 'project_view': update.$inc.projectViews = 1; break;
      case 'hire_click': update.$inc.hireMeClicks = 1; break;
      case 'contact_submit': update.$inc.contactSubmissions = 1; break;
      case 'hire_submit': update.$inc.hireSubmissions = 1; break;
      case 'review_submit': update.$inc.reviewSubmissions = 1; break;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Analytics.findOneAndUpdate({ date: today }, update, { upsert: true, new: true });

    return successResponse(res, 'Tracked');
  } catch (error) {
    // Don't block the user on analytics errors
    return successResponse(res, 'Tracked');
  }
};

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get aggregated stats
    const [
      todayStats,
      monthlyAnalytics,
      totalVisitsAgg,
      totalContacts,
      unreadContacts,
      totalHire,
      totalReviews,
      pendingReviews,
      totalProjects,
    ] = await Promise.all([
      Analytics.findOne({ date: today }),
      Analytics.find({ date: { $gte: monthStart } }).sort({ date: 1 }),
      Analytics.aggregate([{ $group: { _id: null, total: { $sum: '$totalVisits' }, resumeDownloads: { $sum: '$resumeDownloads' }, githubClicks: { $sum: '$githubClicks' } } }]),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      HireRequest.countDocuments(),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'pending' }),
      Project.countDocuments({ isVisible: true }),
    ]);

    const allTime = totalVisitsAgg[0] || { total: 0, resumeDownloads: 0, githubClicks: 0 };

    // Device breakdown (all time)
    const deviceAgg = await Analytics.aggregate([
      { $group: { _id: null, desktop: { $sum: '$desktop' }, mobile: { $sum: '$mobile' }, tablet: { $sum: '$tablet' } } }
    ]);

    // Browser breakdown (all time)
    const browserAgg = await Analytics.aggregate([
      { $group: { _id: null, chrome: { $sum: '$chrome' }, firefox: { $sum: '$firefox' }, safari: { $sum: '$safari' }, edge: { $sum: '$edge' }, other: { $sum: '$other' } } }
    ]);

    return successResponse(res, 'Dashboard stats fetched', {
      todayVisits: todayStats?.totalVisits || 0,
      monthlyVisits: monthlyAnalytics.reduce((sum, d) => sum + (d.totalVisits || 0), 0),
      totalVisits: allTime.total,
      resumeDownloads: allTime.resumeDownloads,
      githubClicks: allTime.githubClicks,
      totalContacts,
      unreadContacts,
      totalHire,
      totalReviews,
      pendingReviews,
      totalProjects,
      devices: deviceAgg[0] || { desktop: 0, mobile: 0, tablet: 0 },
      browsers: browserAgg[0] || {},
      monthlyChart: monthlyAnalytics.map((d) => ({
        date: d.date,
        visits: d.totalVisits || 0,
        contacts: d.contactSubmissions || 0,
        hires: d.hireSubmissions || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};
