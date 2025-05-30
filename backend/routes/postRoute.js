const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  getAllPosts,
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getUserPosts,
  getLikedPosts,
  getFollowingPosts
} = require("../controllers/postController");

const router = express.Router();
router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.get("/user/:userName", protectRoute, getUserPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.delete("/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.get("/following", protectRoute, getFollowingPosts);


module.exports = router;
