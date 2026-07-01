const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to check express-validator results
 * Place AFTER validation rules in route definitions
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg).join(', ');
    return errorResponse(res, messages, 422);
  }
  next();
};

module.exports = validate;
