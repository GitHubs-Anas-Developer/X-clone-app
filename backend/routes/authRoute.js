const express = require("express");
const {
  signup,
  login,
  logout,
  getme,
} = require("../controllers/authController");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

// User signup route
router.post("/signup", signup);

// User login route
router.post("/login", login);

// User logout route
router.post("/logout", logout);

router.get("/me",protectRoute, getme);

module.exports = router;
