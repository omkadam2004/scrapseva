const express = require("express");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

const router = express.Router();

/* ================= COLLECTORS ================= */

// Get all collectors
router.get("/collectors", async (req, res) => {
  const collectors = await User.find({ role: "collector" });
  res.json(collectors);
});

// Approve / Reject collector
router.patch("/collectors/:id/verify", async (req, res) => {
  try {
    const { status } = req.body; // true or false

    const collector = await User.findById(req.params.id);
    if (!collector) {
      return res.status(404).json({ message: "Collector not found" });
    }

    collector.isVerified = status;
    await collector.save();

    res.json({
      message: status ? "Collector approved" : "Collector rejected",
      collector
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove collector
router.delete("/collectors/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Collector removed" });
});

/* ================= SELLERS ================= */

// Get sellers
router.get("/sellers", async (req, res) => {
  const sellers = await User.find({ role: "seller" });
  res.json(sellers);
});

// Remove seller
router.delete("/sellers/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Seller removed" });
});

/* ================= FEEDBACK ================= */

// Get feedback
router.get("/feedbacks", async (req, res) => {
  const feedbacks = await Feedback.find();
  res.json(feedbacks);
});

// Remove feedback
router.delete("/feedbacks/:id", async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: "Feedback removed" });
});

module.exports = router;
