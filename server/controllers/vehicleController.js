const fs = require("fs");
const path = require("path");

const Vehicle = require("../models/Vehicle");

// Delete an uploaded vehicle photo from the server.
// This is used when a photo is replaced, removed,
// or the entire vehicle is deleted.
const deletePhotoFile = (photoPath) => {
  if (!photoPath) {
    return;
  }

  // path.basename prevents a stored path from pointing
  // outside the vehicle upload directory.
  const filename = path.basename(photoPath);

  const fullPath = path.join(__dirname, "../uploads/vehicles", filename);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// Convert Multer's uploaded file information into the
// public path that will be stored in MongoDB.
const getUploadedPhotoPath = (file) => {
  if (!file) {
    return null;
  }

  return `/uploads/vehicles/${file.filename}`;
};

// Create a new vehicle for the logged-in user.
const createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      registration,
      transmission,
      mileage,
      wofExpiry,
      registrationExpiry,
      nextServiceMileage,
      notes,
    } = req.body;

    // Check the required vehicle information.
    if (
      !make ||
      !model ||
      !year ||
      !registration ||
      !transmission ||
      mileage === undefined
    ) {
      // If Multer already uploaded a photo but validation
      // fails, remove the unused file.
      if (req.file) {
        deletePhotoFile(getUploadedPhotoPath(req.file));
      }

      return res.status(400).json({
        message: "Please provide all required vehicle details",
      });
    }

    // Create the vehicle and automatically assign it
    // to the authenticated user.
    const vehicle = await Vehicle.create({
      owner: req.userId,
      make,
      model,
      year: Number(year),
      registration,
      transmission,
      mileage: Number(mileage),

      wofExpiry: wofExpiry || null,

      registrationExpiry: registrationExpiry || null,

      nextServiceMileage:
        nextServiceMileage === "" ||
        nextServiceMileage === undefined ||
        nextServiceMileage === null
          ? null
          : Number(nextServiceMileage),

      notes: notes || "",

      // If no photo was uploaded, this will be null.
      photo: getUploadedPhotoPath(req.file),
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    // Prevent unused files remaining on the server
    // if vehicle creation fails.
    if (req.file) {
      deletePhotoFile(getUploadedPhotoPath(req.file));
    }

    console.error("Create vehicle error:", error.message);

    res.status(500).json({
      message: "Server error while creating vehicle",
    });
  }
};

// Get all vehicles belonging to the logged-in user.
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Get vehicles error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving vehicles",
    });
  }
};

// Get one vehicle belonging to the logged-in user.
const getVehicleById = async (req, res) => {
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

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Get vehicle error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving vehicle",
    });
  }
};

// Update a vehicle belonging to the logged-in user.
const updateVehicle = async (req, res) => {
  try {
    // Find the vehicle first so that we can keep track
    // of its existing photo.
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!vehicle) {
      // If a file was uploaded before discovering that
      // the vehicle does not exist, clean it up.
      if (req.file) {
        deletePhotoFile(getUploadedPhotoPath(req.file));
      }

      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const oldPhoto = vehicle.photo;

    // Only allow normal editable vehicle fields to be
    // updated from the request.
    //
    // This prevents fields such as owner and shareToken
    // from being changed through the vehicle edit form.
    const allowedFields = [
      "make",
      "model",
      "year",
      "registration",
      "transmission",
      "mileage",
      "wofExpiry",
      "registrationExpiry",
      "nextServiceMileage",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        vehicle[field] = req.body[field];
      }
    });

    // multipart/form-data sends normal form values
    // as strings, so convert numeric values back
    // into numbers before saving.
    vehicle.year = Number(vehicle.year);
    vehicle.mileage = Number(vehicle.mileage);

    // Empty date inputs should be stored as null.
    vehicle.wofExpiry = vehicle.wofExpiry || null;

    vehicle.registrationExpiry = vehicle.registrationExpiry || null;

    // Empty next-service mileage should also be null.
    vehicle.nextServiceMileage =
      vehicle.nextServiceMileage === "" ||
      vehicle.nextServiceMileage === undefined ||
      vehicle.nextServiceMileage === null
        ? null
        : Number(vehicle.nextServiceMileage);

    // The React form will send removePhoto=true when
    // the user deliberately removes the existing image.
    const removePhoto = req.body.removePhoto === "true";

    if (req.file) {
      // A new photo replaces the existing photo.
      vehicle.photo = getUploadedPhotoPath(req.file);
    } else if (removePhoto) {
      // No replacement photo was selected, but the
      // user explicitly requested removal.
      vehicle.photo = null;
    }

    await vehicle.save();

    // Only delete the previous image after MongoDB has
    // successfully saved the updated vehicle.
    if ((req.file || removePhoto) && oldPhoto && oldPhoto !== vehicle.photo) {
      deletePhotoFile(oldPhoto);
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    // If a new image was uploaded but saving failed,
    // remove that unused new image.
    if (req.file) {
      deletePhotoFile(getUploadedPhotoPath(req.file));
    }

    console.error("Update vehicle error:", error.message);

    res.status(500).json({
      message: "Server error while updating vehicle",
    });
  }
};

// Delete a vehicle belonging to the logged-in user.
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Also remove the vehicle's uploaded photo
    // so unused files are not left on the server.
    deletePhotoFile(vehicle.photo);

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error.message);

    res.status(500).json({
      message: "Server error while deleting vehicle",
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
