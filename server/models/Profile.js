const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Priyansh Rajput' },
    tagline: { type: String, default: 'Full Stack MERN Developer' },
    bio: {
      type: String,
      default:
        'Passionate Full Stack MERN Developer with 3 years of experience building scalable web applications. I love crafting clean, performant code and pixel-perfect UIs.',
    },
    shortBio: {
      type: String,
      default: 'Full Stack MERN Developer | 3 Years Experience | Student',
    },
    email: { type: String, default: 'priyanshrajput@gmail.com' },
    phone: { type: String, default: '+91 XXXXXXXXXX' },
    location: { type: String, default: 'India' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    resume: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    // Social links
    github: { type: String, default: 'https://github.com/priyanshrajput' },
    linkedin: { type: String, default: 'https://linkedin.com/in/priyanshrajput' },
    twitter: { type: String, default: 'https://twitter.com/priyanshrajput' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    website: { type: String, default: '' },
    // Stats
    yearsExperience: { type: Number, default: 3 },
    projectsCompleted: { type: Number, default: 20 },
    happyClients: { type: Number, default: 15 },
    coffeeConsumed: { type: Number, default: 1000 },
    // Availability
    isAvailable: { type: Boolean, default: true },
    availabilityText: { type: String, default: 'Open to opportunities' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
