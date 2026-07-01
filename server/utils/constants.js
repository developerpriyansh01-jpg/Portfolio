/**
 * Application-wide constants
 */

exports.PROJECT_CATEGORIES = ['fullstack', 'frontend', 'backend', 'mobile', 'ai-ml', 'open-source', 'other'];
exports.PROJECT_STATUSES = ['completed', 'in-progress', 'maintained', 'archived'];
exports.SKILL_CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'];
exports.CERTIFICATE_CATEGORIES = ['frontend', 'backend', 'cloud', 'database', 'ai-ml', 'security', 'other'];
exports.EMPLOYMENT_TYPES = ['full-time', 'part-time', 'freelance', 'internship', 'contract'];
exports.CONTACT_STATUSES = ['unread', 'read', 'replied', 'archived'];
exports.REVIEW_STATUSES = ['pending', 'approved', 'rejected'];
exports.HIRE_STATUSES = ['new', 'reviewing', 'contacted', 'hired', 'declined'];
exports.BUDGET_OPTIONS = ['< $500', '$500-$1000', '$1000-$5000', '$5000-$10000', '$10000+', 'Negotiable'];
exports.TIMELINE_OPTIONS = ['< 1 week', '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months'];
exports.PROJECT_TYPES = ['web-app', 'mobile-app', 'api', 'ecommerce', 'portfolio', 'consulting', 'other'];

exports.CLOUDINARY_FOLDERS = {
  PROFILE: 'portfolio/profile',
  PROJECTS: 'portfolio/projects',
  CERTIFICATES: 'portfolio/certificates',
  EXPERIENCE: 'portfolio/experience',
  REVIEWS: 'portfolio/reviews',
  RESUME: 'portfolio/resume',
  CONTACTS: 'portfolio/contacts',
};

exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};
