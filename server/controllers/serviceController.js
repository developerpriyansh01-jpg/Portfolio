const Service = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isVisible: true }).sort({ order: 1 });
    return successResponse(res, 'Services fetched', services);
  } catch (error) { next(error); }
};

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    return successResponse(res, 'All services fetched', services);
  } catch (error) { next(error); }
};

exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'create', module: 'services', description: `Service created: ${service.title}`, targetId: service._id.toString(), targetTitle: service.title, status: 'success' });
    return successResponse(res, 'Service created', service, 201);
  } catch (error) { next(error); }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return errorResponse(res, 'Service not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'update', module: 'services', description: `Service updated: ${service.title}`, targetId: service._id.toString(), targetTitle: service.title, status: 'success' });
    return successResponse(res, 'Service updated', service);
  } catch (error) { next(error); }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return errorResponse(res, 'Service not found', 404);
    await ActivityLog.create({ user: req.user._id, userName: req.user.name, action: 'delete', module: 'services', description: `Service deleted: ${service.title}`, targetId: service._id.toString(), targetTitle: service.title, status: 'success' });
    return successResponse(res, 'Service deleted');
  } catch (error) { next(error); }
};
