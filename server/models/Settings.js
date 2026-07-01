const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    // Site identity
    siteName: { type: String, default: 'Priyansh Rajput | Portfolio' },
    siteTagline: { type: String, default: 'Full Stack MERN Developer' },
    siteDescription: {
      type: String,
      default:
        'Priyansh Rajput - Full Stack MERN Web Developer with 3 years of experience building scalable web applications.',
    },
    siteKeywords: {
      type: String,
      default: 'Priyansh Rajput, Full Stack Developer, MERN, React, Node.js, Portfolio',
    },
    siteVersion: { type: String, default: '1.0.0' },
    // SEO
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    googleVerification: { type: String, default: '' },
    // Analytics
    googleAnalyticsId: { type: String, default: '' },
    // Features toggles
    showReviews: { type: Boolean, default: true },
    showGithubStats: { type: Boolean, default: true },
    showCodingProfiles: { type: Boolean, default: true },
    showVisitorCount: { type: Boolean, default: true },
    allowReviewSubmissions: { type: Boolean, default: true },
    // Maintenance
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'Site is under maintenance. Back soon!' },
    // Theme
    primaryColor: { type: String, default: '#00d4ff' },
    accentColor: { type: String, default: '#a855f7' },
    // FAQ items
    faq: [
      {
        question: { type: String },
        answer: { type: String },
        order: { type: Number, default: 0 },
        isVisible: { type: Boolean, default: true },
      },
    ],
    // Coding profiles
    codingProfiles: [
      {
        platform: { type: String },
        username: { type: String },
        url: { type: String },
        icon: { type: String },
        color: { type: String },
      },
    ],
    // Tech stack display
    techStackItems: [
      {
        name: { type: String },
        icon: { type: String },
        color: { type: String },
        category: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
