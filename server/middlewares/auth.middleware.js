const mongoose = require('mongoose');
const config = require('../config');
const authService = require('../services/auth.service');

/**
 * Ensures Database and JWT secret are ready before servicing auth requests
 */
function requireDbReady(req, res, next) {
  if (!config.jwt.secret || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Authentication service is unavailable. Please try again later.',
    });
  }
  next();
}

/**
 * Middleware to authenticate requests via session cookie
 */
async function authenticate(req, res, next) {
  const token = req.cookies[config.cookie.name];
  if (!token) {
    return res.status(401).json({ message: 'Please sign in again' });
  }

  try {
    const payload = authService.verifyToken(token);
    if (!mongoose.isValidObjectId(payload.sub)) {
      throw new Error('Invalid subject');
    }

    const user = await authService.getUserById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch {
    res.clearCookie(config.cookie.name, config.cookie.options);
    return res.status(401).json({ message: 'Please sign in again' });
  }
}

module.exports = {
  requireDbReady,
  authenticate,
};
