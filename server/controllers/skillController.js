const Skill = require('../models/Skill');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const filter = { isVisible: true };
    if (req.query.category) filter.category = req.query.category;
    const skills = await Skill.find(filter).sort({ category: 1, order: 1 });
    return successResponse(res, 'Skills fetched', skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all skills (admin - includes hidden)
// @route   GET /api/skills/all
// @access  Private
exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    return successResponse(res, 'All skills fetched', skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    await ActivityLog.create({
      user: req.user._id, userName: req.user.name,
      action: 'create', module: 'skills',
      description: `Skill created: ${skill.name}`,
      targetId: skill._id.toString(), targetTitle: skill.name, status: 'success',
    });
    return successResponse(res, 'Skill created', skill, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return errorResponse(res, 'Skill not found', 404);
    await ActivityLog.create({
      user: req.user._id, userName: req.user.name,
      action: 'update', module: 'skills',
      description: `Skill updated: ${skill.name}`,
      targetId: skill._id.toString(), targetTitle: skill.name, status: 'success',
    });
    return successResponse(res, 'Skill updated', skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return errorResponse(res, 'Skill not found', 404);
    await ActivityLog.create({
      user: req.user._id, userName: req.user.name,
      action: 'delete', module: 'skills',
      description: `Skill deleted: ${skill.name}`,
      targetId: skill._id.toString(), targetTitle: skill.name, status: 'success',
    });
    return successResponse(res, 'Skill deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update order
// @route   PUT /api/skills/reorder
// @access  Private
exports.reorderSkills = async (req, res, next) => {
  try {
    const { items } = req.body; // [{id, order}]
    const updates = items.map(({ id, order }) =>
      Skill.findByIdAndUpdate(id, { order }, { new: true })
    );
    await Promise.all(updates);
    return successResponse(res, 'Skills reordered');
  } catch (error) {
    next(error);
  }
};
