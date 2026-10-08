// // Load environment variables from the .env file
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");

// const authRoutes = require("./routes/authRoutes");
// const vehicleRoutes = require("./routes/vehicleRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const shareRoutes = require("./routes/shareRoutes");

// // Create the Express application
// const app = express();

// // Allow the frontend to communicate with the backend
// app.use(cors());

// // Allow Express to read JSON data sent in request bodies
// app.use(express.json());

// // Make uploaded vehicle photos publicly accessible.
// //
// // For example:
// // /uploads/vehicles/car.jpg
// // becomes available from:
// // http://localhost:5000/uploads/vehicles/car.jpg
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Authentication API routes
// app.use("/api/auth", authRoutes);

// // Vehicle API routes
// app.use("/api/vehicles", vehicleRoutes);

// // Service history API routes
// app.use("/api", serviceRoutes);

// // Service history sharing API routes
// app.use("/api", shareRoutes);

// // Simple test route to confirm that the API is running
// app.get("/", (req, res) => {
//   res.json({ message: "CarKeeper API is running" });
// });

// // Use the PORT from .env, or 5000 if one has not been provided
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB before starting the Express server
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     serverSelectionTimeoutMS: 10000,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");

//     // Start the server only after the database connection succeeds
//     app.listen(PORT, () => {
//       console.log(`CarKeeper server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error.message);
//   });

// Load environment variables from the .env file.
require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");

// Use the PORT from .env, or 5000 if one has not been provided.
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the Express server.
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server only after the database connection succeeds.
    app.listen(PORT, () => {
      console.log(`CarKeeper server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
