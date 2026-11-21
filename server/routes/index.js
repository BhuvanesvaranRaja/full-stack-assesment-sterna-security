const express = require('express');
const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const locationRoutes = require('./location.routes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);

module.exports = router;
