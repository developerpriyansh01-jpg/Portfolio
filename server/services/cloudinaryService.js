const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} folder - Cloudinary folder path
 * @param {object} options - Additional Cloudinary options
 * @returns {Promise<{url: string, publicId: string}>}
 */
exports.uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
          ...(options.transformations || []),
        ],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete a resource from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
exports.deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return null;
  }
};

/**
 * Upload image with thumbnail transformation
 */
exports.uploadThumbnail = (buffer, folder) => {
  return exports.uploadToCloudinary(buffer, folder, {
    transformations: [{ width: 800, height: 500, crop: 'fill', gravity: 'center' }],
  });
};

/**
 * Upload avatar with circle crop
 */
exports.uploadAvatar = (buffer) => {
  return exports.uploadToCloudinary(buffer, 'portfolio/avatars', {
    transformations: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  });
};

/**
 * Upload resume PDF
 */
exports.uploadResume = (buffer) => {
  return exports.uploadToCloudinary(buffer, 'portfolio/resume', {
    resource_type: 'raw',
    transformations: [],
  });
};
