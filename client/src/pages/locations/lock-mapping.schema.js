import { z } from "zod";

const text = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(80, `${label} must not exceed 80 characters`);

export const lockMappingSchema = z.object({
  lockName: text("Lock name"),
  assetMarking: text("Asset marking").transform((value) => value.toUpperCase()),
  lockType: text("Lock type"),
  batteryPercentage: z.preprocess(
    (value) => (value === "" ? null : Number(value)),
    z
      .number()
      .int("Enter a whole number")
      .min(0, "Minimum is 0")
      .max(100, "Maximum is 100")
      .nullable(),
  ),
});
