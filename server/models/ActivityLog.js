const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'create',
        'update',
        'delete',
        'upload',
        'approve',
        'reject',
        'feature',
        'settings_change',
        'password_change',
        'other',
      ],
    },
    module: {
      type: String,
      enum: [
        'auth',
        'profile',
        'skills',
        'services',
        'projects',
        'experience',
        'certificates',
        'reviews',
        'contacts',
        'hireRequests',
        'settings',
        'analytics',
        'upload',
        'other',
      ],
    },
    description: { type: String },
    targetId: { type: String }, // ID of the affected document
    targetTitle: { type: String }, // Human-readable name of affected item
    ipAddress: { type: String },
    userAgent: { type: String },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1, user: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
