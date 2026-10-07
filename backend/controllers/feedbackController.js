const Feedback = require("../models/Feedback");

// Submit new feedback
exports.submitFeedback = async (req, res) => {
  try {
    // Create feedback using the request body (no _id needed)
    const feedback = new Feedback({
      rating: req.body.rating,
      category: req.body.category,
      comment: req.body.comment,
      userName: req.body.userName,
      userRole: req.body.userRole,
      date: req.body.date || Date.now(),
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback saved successfully", feedback });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};
