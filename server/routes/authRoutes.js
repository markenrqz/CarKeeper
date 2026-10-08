const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
// Creates a new CarKeeper user account
router.post("/register", registerUser);

// POST /api/auth/login
// Authenticates a CarKeeper user and returns a JWT
router.post("/login", loginUser);

// GET /api/auth/profile
// Temporary protected route used to test JWT authentication
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    userId: req.userId,
  });
});

module.exports = router;
