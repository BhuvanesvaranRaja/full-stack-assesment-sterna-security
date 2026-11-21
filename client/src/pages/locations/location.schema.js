import { z } from "zod";

const locationField = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(80, `${label} must not exceed 80 characters`);

export const locationSchema = z.object({
  name: locationField("Location name"),
  city: locationField("City"),
});
