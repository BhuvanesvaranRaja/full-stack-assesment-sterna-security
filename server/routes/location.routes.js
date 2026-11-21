const express = require("express");
const locationController = require("../controllers/location.controller");
const { createLocationSchema } = require("../validators/location.validator");
const { validateBody } = require("../middlewares/validate.middleware");
const {
  noCache,
  corsAndOriginGuard,
} = require("../middlewares/security.middleware");
const {
  requireDbReady,
  authenticate,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply security and cache-control middlewares
router.use(noCache);
router.use(corsAndOriginGuard);
router.use(requireDbReady);
router.use(authenticate);

// Location endpoints
router.get("/", locationController.getLocations);
router.post(
  "/",
  validateBody(createLocationSchema),
  locationController.createLocation,
);

const mappingController = require("../controllers/lock-mapping.controller");
const {
  lockMappingSchema,
  validateMappingIds,
} = require("../validators/lock-mapping.validator");

router.get(
  "/:locationId/lock-mappings",
  validateMappingIds,
  mappingController.list,
);
router.post(
  "/:locationId/lock-mappings",
  validateMappingIds,
  validateBody(lockMappingSchema),
  mappingController.save,
);
router.put(
  "/:locationId/lock-mappings/:mappingId",
  validateMappingIds,
  validateBody(lockMappingSchema),
  mappingController.save,
);
router.delete(
  "/:locationId/lock-mappings/:mappingId",
  validateMappingIds,
  mappingController.remove,
);

module.exports = router;
