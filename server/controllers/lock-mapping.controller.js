const service = require('../services/lock-mapping.service');

/**
 * Return the lock mappings for the requested location, forwarding errors to middleware.
 */
async function list(req, res, next) {
  try {
    res.json(await service.list(req.params.locationId, req.query));
  } catch (error) { next(error); }
}

/**
 * Create or update a location mapping and return it with the appropriate HTTP status.
 */
async function save(req, res, next) {
  try {
    const mapping = await service.save(req.params.locationId, req.params.mappingId, req.body, req.user.id);
    res.status(req.params.mappingId ? 200 : 201).json({ mapping });
  } catch (error) { next(error); }
}

/**
 * Delete the requested mapping and return an empty success response.
 */
async function remove(req, res, next) {
  try {
    await service.remove(req.params.locationId, req.params.mappingId);
    res.status(204).end();
  } catch (error) { next(error); }
}

module.exports = { list, save, remove };
