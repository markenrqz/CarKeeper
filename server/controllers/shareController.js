const crypto = require("crypto");

const Vehicle = require("../models/Vehicle");
const ServiceRecord = require("../models/ServiceRecord");

// =========================
// Enable Sharing
// =========================

const enableSharing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // If sharing is already enabled, keep the
    // existing link rather than generating another.
    if (!vehicle.shareToken) {
      vehicle.shareToken = crypto.randomBytes(32).toString("hex");

      await vehicle.save();
    }

    return res.status(200).json({
      message: "Service history sharing enabled",
      shareToken: vehicle.shareToken,
    });
  } catch (error) {
    console.error("Enable sharing error:", error);

    return res.status(500).json({
      message: "Unable to enable sharing",
    });
  }
};

// =========================
// Disable Sharing
// =========================

const disableSharing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Removing the token immediately invalidates
    // the previously shared public URL.
    vehicle.shareToken = null;

    await vehicle.save();

    return res.status(200).json({
      message: "Service history sharing disabled",
    });
  } catch (error) {
    console.error("Disable sharing error:", error);

    return res.status(500).json({
      message: "Unable to disable sharing",
    });
  }
};

// =========================
// Public Shared History
// =========================

const getSharedVehicle = async (req, res) => {
  try {
    // This endpoint intentionally does NOT require
    // authentication. The share token acts as the
    // public identifier.
    const vehicle = await Vehicle.findOne({
      shareToken: req.params.shareToken,
    }).select(
      "make model year registration transmission mileage wofExpiry registrationExpiry"
    );

    if (!vehicle) {
      return res.status(404).json({
        message:
          "Shared vehicle history not found or sharing has been disabled",
      });
    }

    const serviceRecords = await ServiceRecord.find({
      vehicle: vehicle._id,
    }).sort({
      date: -1,
    });

    // Only vehicle/service information is returned.
    // Owner account information is never exposed.
    return res.status(200).json({
      vehicle,
      serviceRecords,
    });
  } catch (error) {
    console.error("Get shared vehicle error:", error);

    return res.status(500).json({
      message: "Unable to load shared vehicle history",
    });
  }
};

module.exports = {
  enableSharing,
  disableSharing,
  getSharedVehicle,
};
