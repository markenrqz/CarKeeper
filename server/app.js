const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const shareRoutes = require("./routes/shareRoutes");

// Create the Express application.
const app = express();

// Allow the frontend to communicate with the backend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Make uploaded vehicle photos publicly accessible.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Authentication API routes.
app.use("/api/auth", authRoutes);

// Vehicle API routes.
app.use("/api/vehicles", vehicleRoutes);

// Service history API routes.
app.use("/api", serviceRoutes);

// Service history sharing API routes.
app.use("/api", shareRoutes);

// Simple route used to confirm that the API is running.
app.get("/", (req, res) => {
  res.json({ message: "CarKeeper API is running" });
});

module.exports = app;
