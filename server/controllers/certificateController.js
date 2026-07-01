const Certificate = require('../models/Certificate');
const ActivityLog = require('../models/ActivityLog');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');

exports.getCertificates = async (req, res, next) => {
  try {
    const filter = { isVisible: true };
    if (req.query.category) filter.category = req.query.category;
    const certs = await Certificate.find(filter).sort({ issueDate: -1 });
    return successResponse(res, 'Certificates fetched', certs);
  } catch (error) { next(error); }
};

exports.getAllCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find().sort({ issueDate: -1 });
    return successResponse(res, 'All certificates fetched', certs);
  } catch (error) { next(error); }
};

exports.createCertificate = async (req, res, next) => {
  try {
    const certData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CERTIFICATES);
      certData.image = { url: result.url, publicId: result.publicId };
    }
    const cert = await Certificate.create(certData);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'create', module: 'certificates', description: `Certificate created: ${cert.title}`, targetId: cert._id.toString(), targetTitle: cert.title, status: 'success' });
    return successResponse(res, 'Certificate created', cert, 201);
  } catch (error) { next(error); }
};

exports.updateCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return errorResponse(res, 'Certificate not found', 404);
    const updates = { ...req.body };
    if (req.file) {
      if (cert.image?.publicId) await deleteFromCloudinary(cert.image.publicId);
      const result = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CERTIFICATES);
      updates.image = { url: result.url, publicId: result.publicId };
    }
    const updated = await Certificate.findByIdAndUpdate(req.params.id, updates, { new: true });
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'update', module: 'certificates', description: `Certificate updated: ${updated.title}`, targetId: updated._id.toString(), targetTitle: updated.title, status: 'success' });
    return successResponse(res, 'Certificate updated', updated);
  } catch (error) { next(error); }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return errorResponse(res, 'Certificate not found', 404);
    if (cert.image?.publicId) await deleteFromCloudinary(cert.image.publicId);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'delete', module: 'certificates', description: `Certificate deleted: ${cert.title}`, status: 'success' });
    return successResponse(res, 'Certificate deleted');
  } catch (error) { next(error); }
};
