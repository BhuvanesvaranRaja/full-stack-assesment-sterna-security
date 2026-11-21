/**
 * 404 handler for unmatched routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Endpoint not found' });
}

/**
 * Centralized global error handling middleware
 */
function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  if (error.status === 413) {
    return res.status(413).json({ message: 'Request is too large' });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error.message);
  return res.status(503).json({ message: 'Service is unavailable. Please try again later.' });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
