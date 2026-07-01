const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: { type: String, default: '' },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [200, 'Subject too long'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message too long'],
    },
    projectType: {
      type: String,
      enum: ['web-app', 'mobile-app', 'api', 'ecommerce', 'portfolio', 'other', ''],
      default: '',
    },
    budget: { type: String, default: '' },
    timeline: { type: String, default: '' },
    attachment: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      originalName: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
    },
    isStarred: { type: Boolean, default: false },
    reply: { type: String, default: '' },
    repliedAt: { type: Date },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
