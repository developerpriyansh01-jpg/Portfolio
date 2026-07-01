const Contact = require('../models/Contact');
const { sendContactNotification, sendAutoReply } = require('../services/emailService');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getPaginationQuery, getPagination, getClientIP } = require('../utils/helpers');
const { CLOUDINARY_FOLDERS } = require('../utils/constants');

// @desc    Submit contact form (public)
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const contactData = { ...req.body, ipAddress: getClientIP(req) };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, CLOUDINARY_FOLDERS.CONTACTS);
      contactData.attachment = { url: result.url, publicId: result.publicId, originalName: req.file.originalname };
    }

    const contact = await Contact.create(contactData);

    // Send notifications (non-blocking)
    Promise.all([
      sendContactNotification(contact).catch(console.error),
      sendAutoReply({ name: contact.name, email: contact.email, subject: contact.subject }).catch(console.error),
    ]);

    return successResponse(res, "Message sent! I'll get back to you within 24-48 hours.", { id: contact._id }, 201);
  } catch (error) { next(error); }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationQuery(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.starred === 'true') filter.isStarred = true;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { subject: { $regex: req.query.search, $options: 'i' } },
    ];

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);
    return res.json({ success: true, data: contacts, pagination: getPagination(page, limit, total) });
  } catch (error) { next(error); }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!contact) return errorResponse(res, 'Message not found', 404);
    return successResponse(res, 'Message fetched', contact);
  } catch (error) { next(error); }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, isStarred: req.body.isStarred },
      { new: true }
    );
    if (!contact) return errorResponse(res, 'Message not found', 404);
    return successResponse(res, 'Status updated', contact);
  } catch (error) { next(error); }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return errorResponse(res, 'Message not found', 404);
    return successResponse(res, 'Message deleted');
  } catch (error) { next(error); }
};

// @desc    Get unread count
// @route   GET /api/contact/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ status: 'unread' });
    return successResponse(res, 'Unread count', { count });
  } catch (error) { next(error); }
};
