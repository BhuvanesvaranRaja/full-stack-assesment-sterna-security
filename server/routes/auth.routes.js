const express = require('express');
const authController = require('../controllers/auth.controller');
const { loginSchema } = require('../validators/auth.validator');
const { validateBody } = require('../middlewares/validate.middleware');
const { noCache, corsAndOriginGuard } = require('../middlewares/security.middleware');
const { requireDbReady, authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply security and cache-control middlewares
router.use(noCache);
router.use(corsAndOriginGuard);

// Logout (can execute even if DB is temporarily disconnected)
router.post('/logout', authController.logout);

// Database & secret check for subsequent auth routes
router.use(requireDbReady);

// Login and Session verification
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
