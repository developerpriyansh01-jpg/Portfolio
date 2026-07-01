const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    projectType: {
      type: String,
      enum: ['web-app', 'mobile-app', 'api', 'ecommerce', 'portfolio', 'consulting', 'other'],
      default: 'web-app',
    },
    budget: {
      type: String,
      enum: ['< $500', '$500-$1000', '$1000-$5000', '$5000-$10000', '$10000+', 'Negotiable'],
      default: 'Negotiable',
    },
    timeline: {
      type: String,
      enum: ['< 1 week', '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months'],
      default: '1 month',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1500, 'Message too long'],
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'contacted', 'hired', 'declined'],
      default: 'new',
    },
    isStarred: { type: Boolean, default: false },
    adminNote: { type: String, default: '' },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HireRequest', hireRequestSchema);
