const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const { uploadToCloudinary, uploadThumbnail, deleteFromCloudinary } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');
const { getPaginationQuery, getPagination } = require('../utils/helpers');

// @desc    Get featured/visible projects (public)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = { isVisible: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    return res.json({ success: true, message: 'Projects fetched', data: projects, pagination: getPagination(page, limit, total) });
  } catch (error) { next(error); }
};

// @desc    Get single project by slug (public)
// @route   GET /api/projects/:slug
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug, isVisible: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) return errorResponse(res, 'Project not found', 404);
    return successResponse(res, 'Project fetched', project);
  } catch (error) { next(error); }
};

// @desc    Get all projects (admin)
// @route   GET /api/projects/admin/all
// @access  Private
exports.getAllProjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);
    return res.json({ success: true, message: 'Projects fetched', data: projects, pagination: getPagination(page, limit, total) });
  } catch (error) { next(error); }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    if (typeof projectData.techStack === 'string') {
      projectData.techStack = projectData.techStack.split(',').map((t) => t.trim());
    }

    // Handle thumbnail upload or URL
    if (req.files?.thumbnail?.[0]) {
      const result = await uploadThumbnail(req.files.thumbnail[0].buffer, CLOUDINARY_FOLDERS.PROJECTS);
      projectData.thumbnail = { url: result.url, publicId: result.publicId };
    } else if (projectData.thumbnailUrl) {
      projectData.thumbnail = { url: projectData.thumbnailUrl, publicId: '' };
    }

    // Handle screenshots upload
    if (req.files?.screenshots?.length > 0) {
      const screenshotUploads = await Promise.all(
        req.files.screenshots.map((file) => uploadToCloudinary(file.buffer, `${CLOUDINARY_FOLDERS.PROJECTS}/screenshots`))
      );
      projectData.screenshots = screenshotUploads.map((r) => ({ url: r.url, publicId: r.publicId }));
    }

    const project = await Project.create(projectData);

    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'create', module: 'projects', description: `Project created: ${project.title}`, targetId: project._id.toString(), targetTitle: project.title, status: 'success' });

    return successResponse(res, 'Project created', project, 201);
  } catch (error) { next(error); }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    const updates = { ...req.body };
    if (typeof updates.techStack === 'string') {
      updates.techStack = updates.techStack.split(',').map((t) => t.trim());
    }

    // New thumbnail or URL
    if (req.files?.thumbnail?.[0]) {
      if (project.thumbnail?.publicId) await deleteFromCloudinary(project.thumbnail.publicId);
      const result = await uploadThumbnail(req.files.thumbnail[0].buffer, CLOUDINARY_FOLDERS.PROJECTS);
      updates.thumbnail = { url: result.url, publicId: result.publicId };
    } else if (updates.thumbnailUrl !== undefined) {
      if (updates.thumbnailUrl) {
        if (project.thumbnail?.publicId && project.thumbnail.url !== updates.thumbnailUrl) {
           await deleteFromCloudinary(project.thumbnail.publicId);
        }
        updates.thumbnail = { url: updates.thumbnailUrl, publicId: '' };
      }
    }

    // Additional screenshots
    if (req.files?.screenshots?.length > 0) {
      const screenshotUploads = await Promise.all(
        req.files.screenshots.map((file) => uploadToCloudinary(file.buffer, `${CLOUDINARY_FOLDERS.PROJECTS}/screenshots`))
      );
      const newScreenshots = screenshotUploads.map((r) => ({ url: r.url, publicId: r.publicId }));
      updates.screenshots = [...(project.screenshots || []), ...newScreenshots];
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'update', module: 'projects', description: `Project updated: ${updated.title}`, targetId: updated._id.toString(), targetTitle: updated.title, status: 'success' });

    return successResponse(res, 'Project updated', updated);
  } catch (error) { next(error); }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    // Delete images from Cloudinary
    if (project.thumbnail?.publicId) await deleteFromCloudinary(project.thumbnail.publicId);
    if (project.screenshots?.length > 0) {
      await Promise.all(project.screenshots.map((s) => deleteFromCloudinary(s.publicId)));
    }

    await project.deleteOne();

    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'delete', module: 'projects', description: `Project deleted: ${project.title}`, targetId: project._id.toString(), targetTitle: project.title, status: 'success' });

    return successResponse(res, 'Project deleted');
  } catch (error) { next(error); }
};

// @desc    Delete a single screenshot
// @route   DELETE /api/projects/:id/screenshots/:publicId
// @access  Private
exports.deleteScreenshot = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    const publicId = decodeURIComponent(req.params.publicId);
    await deleteFromCloudinary(publicId);
    project.screenshots = project.screenshots.filter((s) => s.publicId !== publicId);
    await project.save();

    return successResponse(res, 'Screenshot deleted', project);
  } catch (error) { next(error); }
};
