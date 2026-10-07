const mongoose = require("mongoose");

const scrapItemSchema = new mongoose.Schema({
  scrapType: String,
  weight: Number,
  price: Number,
  description: String,
});

const scrapRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // NOT ObjectId (important)
      required: true,
    },
    sellerName: String,
    items: [scrapItemSchema],
    totalWeight: Number,
    totalPrice: Number,
    address: String,
    scheduledTime: Date,
    status: {
      type: String,
      default: "pending",
    },
    assignedCollectorId: {
      type: String,
      default: null,
    },
    assignedCollectorName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScrapRequest", scrapRequestSchema);
