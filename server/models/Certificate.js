const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    credentialUrl: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'cloud', 'database', 'ai-ml', 'security', 'other'],
      default: 'other',
    },
    skills: [{ type: String }],
    issueDate: { type: Date },
    expiryDate: { type: Date },
    hasExpiry: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
