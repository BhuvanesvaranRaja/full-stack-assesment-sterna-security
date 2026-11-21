const { z } = require('zod');

const createLocationSchema = z.object({
  name: z
    .string({ required_error: 'Location name is required' })
    .trim()
    .min(1, 'Location name is required')
    .max(80, 'Location name must not exceed 80 characters'),
  city: z
    .string({ required_error: 'City is required' })
    .trim()
    .min(1, 'City is required')
    .max(80, 'City must not exceed 80 characters'),
});

module.exports = {
  createLocationSchema,
};
