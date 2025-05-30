const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggeste", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUser);

module.exports = router;
