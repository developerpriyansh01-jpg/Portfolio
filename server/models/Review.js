const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    company: { type: String, trim: true, default: '' },
    position: { type: String, trim: true, default: '' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    message: {
      type: String,
      required: [true, 'Review message is required'],
      maxlength: [1000, 'Message too long'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: { type: Boolean, default: false },
    // Admin editable fields
    adminNote: { type: String, default: '' },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, isFeatured: 1 });

// Static method for average rating
reviewSchema.statics.getAverageRating = async function () {
  const result = await this.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  return result[0] || { avgRating: 0, count: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);
