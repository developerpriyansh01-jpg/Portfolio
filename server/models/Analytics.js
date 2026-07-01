const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Page visits
    totalVisits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    // Feature clicks
    resumeDownloads: { type: Number, default: 0 },
    githubClicks: { type: Number, default: 0 },
    projectViews: { type: Number, default: 0 },
    hireMeClicks: { type: Number, default: 0 },
    contactSubmissions: { type: Number, default: 0 },
    hireSubmissions: { type: Number, default: 0 },
    reviewSubmissions: { type: Number, default: 0 },
    // Device breakdown
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
    // Browser breakdown
    chrome: { type: Number, default: 0 },
    firefox: { type: Number, default: 0 },
    safari: { type: Number, default: 0 },
    edge: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    // Traffic sources
    direct: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    search: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    // Countries (top 10)
    countries: [
      {
        country: String,
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// One document per day
// Date field is already indexed inline in the schema definition

module.exports = mongoose.model('Analytics', analyticsSchema);
