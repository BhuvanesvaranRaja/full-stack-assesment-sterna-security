const config = require('../config');

/**
 * Disables browser caching for sensitive endpoints
 */
function noCache(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

/**
 * Validates request origin and content type for mutating requests
 */
function corsAndOriginGuard(req, res, next) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const allowed = config.appOrigin;
    if (
      (req.headers.origin && req.headers.origin !== allowed) ||
      req.headers['sec-fetch-site'] === 'cross-site'
    ) {
      return res.status(403).json({ message: 'Request origin is not allowed' });
    }
    const hasBody = Boolean(req.headers['transfer-encoding']) || Number(req.headers['content-length'] || 0) > 0;
    const requiresJson = ['POST', 'PUT', 'PATCH'].includes(req.method) || hasBody;
    if (requiresJson && !req.is('application/json')) {
      return res.status(415).json({ message: 'Use application/json' });
    }
  }
  next();
}

module.exports = {
  noCache,
  corsAndOriginGuard,
};
