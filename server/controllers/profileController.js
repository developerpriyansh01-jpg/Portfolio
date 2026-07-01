const Profile = require('../models/Profile');
const ActivityLog = require('../models/ActivityLog');
const { uploadToCloudinary, deleteFromCloudinary, uploadAvatar, uploadResume } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    return successResponse(res, 'Profile fetched', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private (Admin)
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    const allowedFields = [
      'name','tagline','bio','shortBio','email','phone','location',
      'github','linkedin','twitter','instagram','youtube','website',
      'yearsExperience','projectsCompleted','happyClients','coffeeConsumed',
      'isAvailable','availabilityText',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    await profile.save();

    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      action: 'update',
      module: 'profile',
      description: 'Profile updated',
      status: 'success',
    });

    return successResponse(res, 'Profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/profile/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 'No image file provided', 400);

    const profile = await Profile.findOne() || new Profile();

    // Delete old avatar
    if (profile.avatar?.publicId) {
      await deleteFromCloudinary(profile.avatar.publicId);
    }

    const result = await uploadAvatar(req.file.buffer);
    profile.avatar = { url: result.url, publicId: result.publicId };
    await profile.save();

    return successResponse(res, 'Avatar uploaded successfully', { avatar: profile.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, 'No file provided', 400);

    const profile = await Profile.findOne() || new Profile();

    // Delete old resume
    if (profile.resume?.publicId) {
      await deleteFromCloudinary(profile.resume.publicId);
    }

    const result = await uploadResume(req.file.buffer);
    profile.resume = { url: result.url, publicId: result.publicId };
    await profile.save();

    return successResponse(res, 'Resume uploaded successfully', { resume: profile.resume });
  } catch (error) {
    next(error);
  }
};
