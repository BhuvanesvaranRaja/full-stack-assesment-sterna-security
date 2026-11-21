const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Constant-time dummy hash to mitigate timing attacks on unknown emails
const DUMMY_HASH = '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';

/**
 * Authenticates user credentials and returns token and user info
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  const hash = user?.passwordHash || DUMMY_HASH;
  const isValid = await bcrypt.compare(password, hash);

  if (!user || !isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({}, config.jwt.secret, {
    subject: user.id,
    expiresIn: config.jwt.expiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    algorithm: config.jwt.algorithm,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

/**
 * Verifies JWT token and returns payload
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret, {
    algorithms: [config.jwt.algorithm],
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  });
}

/**
 * Retrieves safe user details by ID
 */
async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
  };
}

module.exports = {
  login,
  verifyToken,
  getUserById,
};
