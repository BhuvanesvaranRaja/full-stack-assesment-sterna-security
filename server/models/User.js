const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true, bufferCommands: false },
);
module.exports = mongoose.model("User", schema);
