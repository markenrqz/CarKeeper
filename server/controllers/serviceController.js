const ServiceRecord = require("../models/ServiceRecord");
const Vehicle = require("../models/Vehicle");

// Add a service record to one of the logged-in user's vehicles
const createServiceRecord = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { serviceType, date, mileage, cost, workshop, notes } = req.body;

    // Make sure the vehicle exists and belongs to the logged-in user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Check required service information
    if (!serviceType || !date || mileage === undefined) {
      return res.status(400).json({
        message: "Service type, date and mileage are required",
      });
    }

    const serviceRecord = await ServiceRecord.create({
      vehicle: vehicleId,
      serviceType,
      date,
      mileage,
      cost,
      workshop,
      notes,
    });

    res.status(201).json({
      message: "Service record added successfully",
      serviceRecord,
    });
  } catch (error) {
    console.error("Create service record error:", error.message);

    res.status(500).json({
      message: "Server error while creating service record",
    });
  }
};

// Get the service history for one of the logged-in user's vehicles
const getServiceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Verify that the vehicle belongs to the logged-in user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Newest service records are returned first
    const serviceRecords = await ServiceRecord.find({
      vehicle: vehicleId,
    }).sort({ date: -1 });

    res.status(200).json(serviceRecords);
  } catch (error) {
    console.error("Get service records error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving service records",
    });
  }
};

// Update a service record belonging to one of the user's vehicles
const updateServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the service record first
    const serviceRecord = await ServiceRecord.findById(id);

    if (!serviceRecord) {
      return res.status(404).json({
        message: "Service record not found",
      });
    }

    // Check that the vehicle linked to this service record
    // belongs to the logged-in user
    const vehicle = await Vehicle.findOne({
      _id: serviceRecord.vehicle,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Service record not found",
      });
    }

    // Update the service record and run schema validation
    const updatedServiceRecord = await ServiceRecord.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Service record updated successfully",
      serviceRecord: updatedServiceRecord,
    });
  } catch (error) {
    console.error("Update service record error:", error.message);

    res.status(500).json({
      message: "Server error while updating service record",
    });
  }
};

// Delete a service record belonging to one of the user's vehicles
const deleteServiceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the service record first
    const serviceRecord = await ServiceRecord.findById(id);

    if (!serviceRecord) {
      return res.status(404).json({
        message: "Service record not found",
      });
    }

    // Verify ownership through the vehicle
    const vehicle = await Vehicle.findOne({
      _id: serviceRecord.vehicle,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Service record not found",
      });
    }

    await ServiceRecord.findByIdAndDelete(id);

    res.status(200).json({
      message: "Service record deleted successfully",
    });
  } catch (error) {
    console.error("Delete service record error:", error.message);

    res.status(500).json({
      message: "Server error while deleting service record",
    });
  }
};

module.exports = {
  createServiceRecord,
  getServiceRecords,
  updateServiceRecord,
  deleteServiceRecord,
};
