const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new CarKeeper user
const registerUser = async (req, res) => {
  try {
    // Get the submitted registration details from the request body
    const { name, email, password } = req.body;

    // Check that all required fields have been provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check whether an account already exists with this email address
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    // Hash the password before storing it in MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return the new user's details without returning their password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Server error while registering user",
    });
  }
};

// Log in an existing CarKeeper user
const loginUser = async (req, res) => {
  try {
    // Get the login details submitted by the user
    const { email, password } = req.body;

    // Make sure both fields have been provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find the user by their email address
    const user = await User.findOne({ email });

    // Do not reveal whether the email or password was incorrect
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare the submitted password with the hashed password in MongoDB
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create a signed JWT containing the user's MongoDB ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return the token and basic user information
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error while logging in",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
