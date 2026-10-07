const Collector = require("../models/Collector");
const ScrapRequest = require("../models/ScrapRequest");
const User = require("../models/User");

// ================= EXISTING CODE (UNCHANGED) =================

// Get all collectors (for seller dropdown)
exports.getAllCollectors = async (req, res) => {
  try {
    const collectors = await User.find(
      { role: "collector" },
      "name email phone operationalArea isVerified"
    ).lean();

    res.status(200).json(collectors);
  } catch (error) {
    console.error("FETCH COLLECTORS ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.registerCollector = async (req, res) => {
  const collector = await Collector.create(req.body);
  res.status(201).json(collector);
};

// Get all pending scrap requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ScrapRequest.find({ status: "pending" })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("FETCH REQUESTS ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get requests assigned to a specific collector
exports.getCollectorRequests = async (req, res) => {
  try {
    const collectorId = req.params.id;

    const requests = await ScrapRequest.find({
      assignedCollectorId: collectorId,
    })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("FETCH COLLECTOR REQUESTS ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept a scrap request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { collectorId } = req.body;

    const collector = await User.findById(collectorId, "name").lean();
    if (!collector) {
      return res.status(404).json({ message: "Collector not found" });
    }

    const request = await ScrapRequest.findByIdAndUpdate(
      requestId,
      {
        status: "accepted",
        assignedCollectorId: collectorId,
        assignedCollectorName: collector.name,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Request accepted successfully",
      data: request,
    });
  } catch (error) {
    console.error("ACCEPT REQUEST ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ScrapRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    console.error("UPDATE REQUEST ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= NEW SAFE ADDITION =================

// ✅ ADMIN: Approve / Reject Collector
exports.verifyCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // true / false

    const collector = await User.findOneAndUpdate(
      { _id: id, role: "collector" },
      { isVerified: status },
      { new: true }
    );

    if (!collector) {
      return res.status(404).json({ message: "Collector not found" });
    }

    res.status(200).json({
      message: status ? "Collector approved" : "Collector rejected",
      collector,
    });
  } catch (error) {
    console.error("VERIFY COLLECTOR ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
