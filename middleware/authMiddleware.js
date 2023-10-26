const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ status: 0, error: 'Access denied' });
  }

  jwt.verify(token, SECRET_KEY, { expiresIn: '15min' }, (err, user) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
