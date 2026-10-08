const express = require("express");

const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const protect = require("../middleware/authMiddleware");
const uploadVehiclePhoto = require("../middleware/uploadVehiclePhoto");

const router = express.Router();

// All vehicle routes require a valid JWT.

// GET /api/vehicles
// Get all vehicles belonging to the logged-in user.
router.get("/", protect, getVehicles);

// POST /api/vehicles
// Add a vehicle to the logged-in user's account.
//
// Multer checks for an optional file with the field name "photo".
// If a photo is included, it is stored before createVehicle runs.
router.post("/", protect, uploadVehiclePhoto.single("photo"), createVehicle);

// GET /api/vehicles/:id
// Get one vehicle belonging to the logged-in user.
router.get("/:id", protect, getVehicleById);

// PUT /api/vehicles/:id
// Update a vehicle belonging to the logged-in user.
//
// The user can also upload a replacement vehicle photo
// while updating the vehicle.
router.put("/:id", protect, uploadVehiclePhoto.single("photo"), updateVehicle);

// DELETE /api/vehicles/:id
// Delete a vehicle belonging to the logged-in user.
router.delete("/:id", protect, deleteVehicle);

module.exports = router;
