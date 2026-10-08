const express = require("express");

const {
  createServiceRecord,
  getServiceRecords,
  updateServiceRecord,
  deleteServiceRecord,
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/vehicles/:vehicleId/services
// Get the service history for a vehicle
router.get("/vehicles/:vehicleId/services", protect, getServiceRecords);

// POST /api/vehicles/:vehicleId/services
// Add a new service record to a vehicle
router.post("/vehicles/:vehicleId/services", protect, createServiceRecord);

// PUT /api/services/:id
// Update an existing service record
router.put("/services/:id", protect, updateServiceRecord);

// DELETE /api/services/:id
// Delete an existing service record
router.delete("/services/:id", protect, deleteServiceRecord);

module.exports = router;
