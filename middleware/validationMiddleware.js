// middleware/validationMiddleware.js

const responseHandler = require('../utils/responseHandler');

function validateRegistration(req, res, next) {
  const { firstName, lastName,username,email,password } = req.body;

  if (!firstName || !lastName || !username ||!email ||!password) {
    return responseHandler.badRequest(res, 'Required all fields', { success: false });
  }
  next();
}

module.exports = {
  validateRegistration,
};
