const locationService = require('../services/location.service');

/**
 * Handle listing all locations
 */
async function getLocations(req, res, next) {
  try {
    const result = await locationService.getLocations(req.query);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handle creating a new location
 */
async function createLocation(req, res, next) {
  try {
    const location = await locationService.createLocation({
      name: req.body.name,
      city: req.body.city,
      userId: req.user?.id,
    });
    return res.status(201).json({
      message: 'Location created successfully',
      location,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLocations,
  createLocation,
};
