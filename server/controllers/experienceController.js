const Experience = require('../models/Experience');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find({ isVisible: true }).sort({ startDate: -1 });
    return successResponse(res, 'Experience fetched', experiences);
  } catch (error) { next(error); }
};

exports.getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    return successResponse(res, 'All experience fetched', experiences);
  } catch (error) { next(error); }
};

exports.createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'create', module: 'experience', description: `Experience created: ${experience.position} at ${experience.company}`, targetId: experience._id.toString(), targetTitle: `${experience.position} at ${experience.company}`, status: 'success' });
    return successResponse(res, 'Experience created', experience, 201);
  } catch (error) { next(error); }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!experience) return errorResponse(res, 'Experience not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'update', module: 'experience', description: `Experience updated: ${experience.position} at ${experience.company}`, targetId: experience._id.toString(), targetTitle: `${experience.position} at ${experience.company}`, status: 'success' });
    return successResponse(res, 'Experience updated', experience);
  } catch (error) { next(error); }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return errorResponse(res, 'Experience not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'delete', module: 'experience', description: `Experience deleted: ${experience.company}`, status: 'success' });
    return successResponse(res, 'Experience deleted');
  } catch (error) { next(error); }
};
