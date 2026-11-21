const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
      index: true,
    },
    lockName: { type: String, required: true, trim: true, maxlength: 80 },
    assetMarking: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 80,
    },
    lockType: { type: String, required: true, trim: true, maxlength: 80 },
    batteryPercentage: { type: Number, min: 0, max: 100, default: null },
    lastCommunicatedAt: { type: Date, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, bufferCommands: false },
);

// An asset can only be mapped once, including concurrent requests.
schema.index({ assetMarking: 1 }, { unique: true });
module.exports = mongoose.model("LockMapping", schema);
