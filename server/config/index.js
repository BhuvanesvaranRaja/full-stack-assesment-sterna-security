require('dotenv').config({ quiet: true });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI,
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '8h',
    issuer: 'mern-app',
    audience: 'mern-client',
    algorithm: 'HS256',
  },
  // Keep the session cookie lifetime aligned with the token expiry above.
  cookie: {
    name: 'mern_session',
    maxAge: 8 * 60 * 60 * 1000,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
  },
};

module.exports = config;
