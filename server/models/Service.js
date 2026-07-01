const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: { type: String, default: '' },
    icon: { type: String, default: 'FaCode' }, // React icon name
    color: { type: String, default: '#00d4ff' },
    gradient: { type: String, default: 'from-cyan-500 to-blue-600' },
    features: [{ type: String }], // List of key features
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
