const mongoose = require("mongoose");

const collectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    area: { type: String },
    vehicleNumber: { type: String },

    // 🔑 REQUIRED FOR APPROVAL + LOGIN
    password: { type: String, required: true },
    role: { type: String, default: "collector" },
    isVerified: { type: Boolean, default: false } // ADMIN APPROVAL FLAG
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collector", collectorSchema);
