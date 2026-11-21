const express = require('express');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

// Mount API routes
app.use('/api', apiRoutes);

// Error and 404 handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
