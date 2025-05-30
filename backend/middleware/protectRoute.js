const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(400).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decode); // Debugging token decoding

    if (!decode) {
      return res.status(400).json({
        message: "Unauthorized: Invalid token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    console.log("User found:", user); // Debugging user retrieval

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in protectRoute middleware: ${error}`);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = protectRoute;
