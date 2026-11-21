const { z } = require('zod');

const text = (label) => z.string({ error: `${label} is required` }).trim()
  .min(1, `${label} is required`).max(80, `${label} must not exceed 80 characters`);

const lockMappingSchema = z.object({
  lockName: text('Lock name'),
  assetMarking: text('Asset marking').transform((value) => value.toUpperCase()),
  lockType: text('Lock type'),
  batteryPercentage: z.number().int('Battery percentage must be a whole number')
    .min(0).max(100).nullable(),
}).strict();

/**
 * Reject malformed location or mapping IDs before allowing the request to continue.
 */
function validateMappingIds(req, res, next) {
  const ids = [req.params.locationId, req.params.mappingId].filter((id) => id !== undefined);
  if (ids.some((id) => !/^[a-f\d]{24}$/i.test(id))) {
    return res.status(400).json({ message: 'Invalid location or mapping ID' });
  }
  next();
}

module.exports = { lockMappingSchema, validateMappingIds };
