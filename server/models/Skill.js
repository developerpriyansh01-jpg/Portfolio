const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    icon: { type: String, default: '' }, // React icon name or image URL
    iconType: {
      type: String,
      enum: ['reacticon', 'image', 'emoji'],
      default: 'reacticon',
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'],
      default: 'frontend',
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    color: { type: String, default: '#00d4ff' }, // Accent color for the skill
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
