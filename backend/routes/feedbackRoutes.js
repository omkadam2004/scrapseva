const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedbackController");

router.post("/", controller.submitFeedback);
router.get("/", controller.getAllFeedback);

module.exports = router;
