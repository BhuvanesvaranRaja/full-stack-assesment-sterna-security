const authService = require('../services/auth.service');
const config = require('../config');

/**
 * Handle user login
 */
async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie(config.cookie.name, token, {
      ...config.cookie.options,
      maxAge: config.cookie.maxAge,
    });

    return res.json({ user });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle user logout
 */
function logout(req, res) {
  res.clearCookie(config.cookie.name, config.cookie.options);
  return res.status(204).end();
}

/**
 * Handle current authenticated user profile
 */
function getMe(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  login,
  logout,
  getMe,
};
