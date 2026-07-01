const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getClientIP } = require('../utils/helpers');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 3. Check active status
    if (!user.isActive) {
      return errorResponse(res, 'Account is disabled', 401);
    }

    // 4. Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 5. Generate token
    const token = user.generateAuthToken();

    // 6. Log activity
    await ActivityLog.create({
      user: user._id,
      userName: user.name,
      action: 'login',
      module: 'auth',
      description: `Admin login from ${getClientIP(req)}`,
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'],
      status: 'success',
    });

    return successResponse(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return successResponse(res, 'User fetched', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    await ActivityLog.create({
      user: user._id,
      userName: user.name,
      action: 'password_change',
      module: 'auth',
      description: 'Password changed',
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'],
      status: 'success',
    });

    const token = user.generateAuthToken();
    return successResponse(res, 'Password changed successfully', { token });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (client-side token deletion, log activity)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    await ActivityLog.create({
      user: req.user._id,
      userName: req.user.name,
      action: 'logout',
      module: 'auth',
      description: 'Admin logged out',
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'],
      status: 'success',
    });
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Register initial admin (only if no users exist)
// @route   POST /api/auth/register
// @access  Public (only works once)
exports.register = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return errorResponse(res, 'Admin already exists. Registration is disabled.', 403);
    }

    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'super_admin' });
    const token = user.generateAuthToken();

    return successResponse(res, 'Admin registered successfully', { token, user }, 201);
  } catch (error) {
    next(error);
  }
};
