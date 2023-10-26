const httpStatusCodes = require('./httpStatusCodes');

function success(res, message, data) {
    res.status(httpStatusCodes.OK).json({ message, status: 1, data });
  }
  

function created(res, message, data = null) {
  res.status(httpStatusCodes.CREATED).json({ message,status:1, data });
}

function badRequest(res, message) {
  res.status(httpStatusCodes.BAD_REQUEST).json({ status:0,error: message });
}

function unauthorized(res, message) {
  res.status(httpStatusCodes.UNAUTHORIZED).json({ error: message });
}

function internalServerError(res, message) {
  res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: message });
}

function notFound(res, message) {
    res.status(httpStatusCodes.NOT_FOUND).json({ error: message });
  }
module.exports = {
  success,
  created,
  badRequest,
  unauthorized,
  internalServerError,
  notFound
};


