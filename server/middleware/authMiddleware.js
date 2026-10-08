const jwt = require("jsonwebtoken");

// Middleware used to protect routes that require a logged-in user
const protect = (req, res, next) => {
  try {
    // Get the Authorization header sent with the request
    const authHeader = req.headers.authorization;

    // The token should be sent as: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized - no token provided",
      });
    }

    // Remove "Bearer " from the header to get the actual JWT
    const token = authHeader.split(" ")[1];

    // Verify that the token was signed using CarKeeper's JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the logged-in user's ID on the request
    // Other controllers can now use req.userId
    req.userId = decoded.userId;

    // Continue to the protected route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized - invalid token",
    });
  }
};

module.exports = protect;
