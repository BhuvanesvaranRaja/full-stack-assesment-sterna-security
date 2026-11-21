import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordEncoder = new TextEncoder();

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter email address")
    .regex(emailPattern, "Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password should contain a minimum of 8 characters")
    .refine(
      (password) => passwordEncoder.encode(password).length <= 72,
      "Password must be at most 72 bytes",
    ),
});
