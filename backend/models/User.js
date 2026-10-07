const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["seller", "collector", "admin"],
      required: true,
    },

    phone: {
  type: String,
  default: null,
},

    // ❌ address REMOVED COMPLETELY
    // address is NOT used in your app

    // ===== COLLECTOR FIELDS =====
    businessName: {
      type: String,
    },

    licenseNumber: {
      type: String,
    },

    operationalArea: {
      type: String,
    },

    experienceYears: {
      type: Number,
    },

    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "seller";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
