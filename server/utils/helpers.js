/**
 * General helper utilities
 */

// Build pagination object for API responses
exports.getPagination = (page, limit, total) => ({
  currentPage: parseInt(page),
  totalPages: Math.ceil(total / limit),
  totalItems: total,
  itemsPerPage: parseInt(limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

// Build pagination query from request
exports.getPaginationQuery = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Format date to readable string
exports.formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate slug from string
exports.generateSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Get client IP from request
exports.getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

// Detect device type from user agent
exports.detectDevice = (userAgent = '') => {
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    if (/iPad/i.test(userAgent)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser from user agent
exports.detectBrowser = (userAgent = '') => {
  if (/Edg/i.test(userAgent)) return 'edge';
  if (/Chrome/i.test(userAgent)) return 'chrome';
  if (/Firefox/i.test(userAgent)) return 'firefox';
  if (/Safari/i.test(userAgent)) return 'safari';
  return 'other';
};
