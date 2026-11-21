const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password should contain a minimum of 8 characters')
    .max(256, 'Password is too long')
    .refine(
      (value) => Buffer.byteLength(value, 'utf8') <= 72,
      'Password must be at most 72 bytes'
    ),
});

module.exports = {
  loginSchema,
};
