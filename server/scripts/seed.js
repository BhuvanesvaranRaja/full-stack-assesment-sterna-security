require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const User = require("../models/User");
/**
 * Validate seed credentials and create a user with a hashed password; reject existing accounts.
 */
async function seedUser(email, password) {
  email = z.string().trim().toLowerCase().email().parse(email);
  password = z
    .string()
    .min(8)
    .max(72, "Seed password must be at most 72 characters")
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Password must be at most 72 bytes",
    )
    .parse(password);
  await User.init();
  if (await User.exists({ email }))
    throw new Error("Account already exists; no changes were made.");
  return User.create({ email, passwordHash: await bcrypt.hash(password, 12) });
}
if (require.main === module) {
  (async () => {
    if (!process.env.MONGODB_URI)
      throw new Error("Set MONGODB_URI in server/.env");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await seedUser(process.env.SEED_EMAIL, process.env.SEED_PASSWORD);
    console.log("Account created successfully.");
  })()
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}
module.exports = { seedUser };
