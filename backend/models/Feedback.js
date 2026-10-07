const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  category: { type: String, required: true },
  comment: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
