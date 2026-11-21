const { parseListQuery, searchRegex, paginationMeta } = require('../utils/pagination');
const User = require('../models/User');
const Location = require("../models/Location");
const LockMapping = require("../models/LockMapping");

/**
 * Throw an error carrying the HTTP status and message used by error middleware.
 */
function fail(statusCode, message) {
  throw Object.assign(new Error(message), { statusCode });
}

/**
 * Verify that the location exists, or throw a 404 error.
 */
async function requireLocation(locationId) {
  if (!(await Location.exists({ _id: locationId })))
    fail(404, "Location not found");
}

// Return the fields the client needs, including the creator email.
function serialize(mapping) {
  return {
    id: mapping._id.toString(),
    lockName: mapping.lockName,
    assetMarking: mapping.assetMarking,
    lockType: mapping.lockType,
    batteryPercentage: mapping.batteryPercentage,
    lastCommunicatedAt: mapping.lastCommunicatedAt,
    createdBy: mapping.createdBy?.email || "Unknown user",
  };
}

/**
 * Return a location’s mappings, newest first, with creator emails included.
 */
async function list(locationId, query) {
  const { search, page, pageSize } = parseListQuery(query);
  await requireLocation(locationId);
  const filter = { location: locationId };
  if (search) {
    const regex = searchRegex(search);
    const creators = await User.find({ email: regex }).select('_id');
    filter.$or = [
      { lockName: regex }, { assetMarking: regex }, { lockType: regex },
      { createdBy: { $in: creators.map((user) => user._id) } },
    ];
  }
  const total = await LockMapping.countDocuments(filter);
  const pagination = paginationMeta(total, page, pageSize);
  const mappings = await LockMapping.find(filter)
    .populate('createdBy', 'email')
    .sort({ createdAt: -1, _id: -1 })
    .skip((pagination.page - 1) * pageSize).limit(pageSize);
  return { mappings: mappings.map(serialize), pagination };
}

/**
 * Create or update a mapping within its location and return its client-facing fields.
 */
async function save(locationId, mappingId, values, userId) {
  await requireLocation(locationId);
  try {
    // Scope updates to the requested location so mappings cannot move implicitly.
    const mapping = mappingId
      ? await LockMapping.findOneAndUpdate(
          { _id: mappingId, location: locationId },
          { $set: values },
          { new: true, runValidators: true },
        )
      : await LockMapping.create({
          ...values,
          location: locationId,
          createdBy: userId,
        });
    if (!mapping) fail(404, "Lock mapping not found");
    await mapping.populate("createdBy", "email");
    return serialize(mapping);
  } catch (error) {
    // Convert a unique-index conflict into a readable API error.
    if (error.code === 11000)
      fail(409, "This asset marking is already mapped to a location");
    throw error;
  }
}

/**
 * Delete a mapping belonging to the location, or throw a 404 if it does not exist.
 */
async function remove(locationId, mappingId) {
  await requireLocation(locationId);
  const mapping = await LockMapping.findOneAndDelete({
    _id: mappingId,
    location: locationId,
  });
  if (!mapping) fail(404, "Lock mapping not found");
}

module.exports = { list, save, remove };
