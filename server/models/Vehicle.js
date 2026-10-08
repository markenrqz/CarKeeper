const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    make: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    registration: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
      min: 0,
    },

    wofExpiry: {
      type: Date,
      default: null,
    },

    registrationExpiry: {
      type: Date,
      default: null,
    },

    nextServiceMileage: {
      type: Number,
      min: 0,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // Stores the path to the optional uploaded vehicle photo.
    // null means the vehicle does not currently have a photo.
    photo: {
      type: String,
      default: null,
    },

    // A random token is generated when the owner
    // enables public service-history sharing.
    //
    // null means sharing is currently disabled.
    shareToken: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
