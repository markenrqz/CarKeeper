const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Store vehicle photos inside server/uploads/vehicles.
const uploadDirectory = path.join(__dirname, "../uploads/vehicles");

// Create the upload folder automatically if it does not exist yet.
fs.mkdirSync(uploadDirectory, { recursive: true });

// Configure where uploaded files are stored and how they are named.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    // Give every uploaded image a unique filename so that
    // files with the same original name do not overwrite each other.
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    callback(null, uniqueName);
  },
});

// Only allow common image formats for vehicle photos.
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, callback) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Only JPG, PNG and WEBP vehicle photos are allowed"));
};

// Configure Multer.
//
// Maximum photo size: 5 MB.
const uploadVehiclePhoto = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadVehiclePhoto;
