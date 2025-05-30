// notificationRoutes.js
const express = require("express");
const {
  deleteNotifications,
  getNotifications,
} = require("../controllers/notificationController");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

// Route to get notifications
router.get("/", protectRoute, getNotifications);
// Route to delete notifications
router.delete("/", protectRoute, deleteNotifications);

module.exports = router;
