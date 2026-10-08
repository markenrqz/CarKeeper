const mongoose = require("mongoose");

// Define the structure of a user document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email is used to log in and must be unique
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // The user's hashed password will be stored here
    // We will never store the plain-text password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    // Automatically creates createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
