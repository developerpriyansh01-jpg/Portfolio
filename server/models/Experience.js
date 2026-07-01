const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    responsibilities: [{ type: String }],
    techStack: [{ type: String }],
    companyLogo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    companyUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'freelance', 'internship', 'contract'],
      default: 'full-time',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ startDate: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
