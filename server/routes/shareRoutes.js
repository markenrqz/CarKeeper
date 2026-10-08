const express = require("express");

const {
  enableSharing,
  disableSharing,
  getSharedVehicle,
} = require("../controllers/shareController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// Protected Owner Routes
// =========================

// Enable public sharing for a vehicle.
router.post("/vehicles/:id/share", authMiddleware, enableSharing);

// Disable public sharing for a vehicle.
router.delete("/vehicles/:id/share", authMiddleware, disableSharing);

// =========================
// Public Route
// =========================

// Anyone with the valid token can view this.
// There is intentionally no authMiddleware here.
router.get("/public/vehicles/:shareToken", getSharedVehicle);

module.exports = router;
