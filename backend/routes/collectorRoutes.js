const express = require("express");
const router = express.Router();
const controller = require("../controllers/collectorController");

router.get("/list", controller.getAllCollectors);
router.post("/register", controller.registerCollector);
router.get("/requests", controller.getAllRequests);
router.get("/requests/:id", controller.getCollectorRequests);
router.post("/accept-request/:requestId", controller.acceptRequest);
router.put("/request/:requestId", controller.updateRequestStatus);

// ✅ NEW — Admin verify collector
router.put("/verify/:id", controller.verifyCollector);

module.exports = router;
