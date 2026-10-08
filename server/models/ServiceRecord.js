const mongoose = require("mongoose");

// Defines a maintenance/service record for a vehicle
const serviceRecordSchema = new mongoose.Schema(
  {
    // Links this service record to a vehicle
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      min: 0,
      default: 0,
    },

    workshop: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // Automatically creates createdAt and updatedAt
    timestamps: true,
  }
);

const ServiceRecord = mongoose.model("ServiceRecord", serviceRecordSchema);

module.exports = ServiceRecord;
