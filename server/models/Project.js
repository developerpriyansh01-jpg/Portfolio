const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: { type: String, unique: true },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
    },
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    screenshots: [
      {
        url: { type: String },
        publicId: { type: String },
        caption: { type: String, default: '' },
      },
    ],
    techStack: [{ type: String }],
    category: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'mobile', 'ai-ml', 'open-source', 'other'],
      default: 'fullstack',
    },
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'maintained', 'archived'],
      default: 'completed',
    },
    views: { type: Number, default: 0 },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate slug from title
projectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
  }
  next();
});

projectSchema.index({ category: 1, isFeatured: 1, displayOrder: 1 });

module.exports = mongoose.model('Project', projectSchema);
