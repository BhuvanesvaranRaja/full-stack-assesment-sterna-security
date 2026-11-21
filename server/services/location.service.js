const { parseListQuery, searchRegex, paginationMeta } = require('../utils/pagination');
const Location = require('../models/Location');

// Treat location names and cities as literal text in duplicate checks.
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Search locations and return one page, sorted newest first
 */
async function getLocations(query) {
  const { search, page, pageSize } = parseListQuery(query);
  // A search with no matches must not create a default location.
  if (!(await Location.exists({}))) {
    await Location.create({ name: 'R S Puram', city: 'Coimbatore' });
  }
  const filter = search ? { $or: [
    { name: searchRegex(search) }, { city: searchRegex(search) },
  ] } : {};
  const total = await Location.countDocuments(filter);
  const pagination = paginationMeta(total, page, pageSize);
  const locations = await Location.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((pagination.page - 1) * pageSize).limit(pageSize);
  return {
    locations: locations.map((loc) => ({
      id: loc._id.toString(), name: loc.name, city: loc.city, createdAt: loc.createdAt,
    })),
    pagination,
  };
}

/**
 * Create a new location with case-insensitive duplicate check
 */
async function createLocation({ name, city, userId }) {
  const trimmedName = name.trim();
  const trimmedCity = city.trim();

  // Check for duplicate name + city (case-insensitive)
  const existing = await Location.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
    city: { $regex: new RegExp(`^${escapeRegex(trimmedCity)}$`, 'i') },
  });

  if (existing) {
    const error = new Error(`Location "${trimmedName}" in "${trimmedCity}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const location = await Location.create({
    name: trimmedName,
    city: trimmedCity,
    createdBy: userId || null,
  });

  return {
    id: location._id.toString(),
    name: location.name,
    city: location.city,
    createdAt: location.createdAt,
  };
}

module.exports = {
  getLocations,
  createLocation,
};
