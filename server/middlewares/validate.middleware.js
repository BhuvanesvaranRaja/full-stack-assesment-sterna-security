const { z } = require('zod');

const VALIDATION_ERROR_MESSAGE = 'Please check the highlighted fields';

/**
 * Middleware factory to validate request body against a Zod schema.
 * @param {import('zod').ZodType} schema - The Zod schema to validate against
 */
function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      return res.status(400).json({
        message: VALIDATION_ERROR_MESSAGE,
        errors: fieldErrors,
      });
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = {
  validateBody,
};
