const mongoose = require('mongoose');

/**
 * Handle system and database health check
 */
function getHealth(req, res) {
  return res.json({
    message: 'React is connected to Express!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
}

module.exports = {
  getHealth,
};
