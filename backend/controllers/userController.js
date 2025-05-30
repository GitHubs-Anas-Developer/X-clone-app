const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");

const getUserProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile ${error}`);
    res.status(500).json({
      message: "internal server error ",
    });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById({ _id: id });

    const currentUser = await User.findById({ _id: req.user._id });

    if (id === req.user._id) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error);
    res.status(500).json({ message: "internal server error " });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("userId", userId);

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    console.log("usersFollowedByMe", usersFollowedByMe);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 5);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error);
    res.status(500).json({ message: "internal server error " });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;

    let { profileImg, coverImg } = req.body;

    let user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    //  Check for both passwords before processing
    if (
      (newPassword && !currentPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both current and new passwords." });
    }

    //  Verify the current password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current password is incorrect." });
      }

      // Ensure the new password meets length requirements
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long." });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    //  Handle profile image upload
    if (profileImg) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    // Handle cover image upload
    if (coverImg) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    //  Update user details
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.userName = username || user.userName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImg || user.profileImage;
    user.coverImage = coverImg || user.coverImage;

    //  Save the updated user
    user = await user.save();

    //  Remove the password from the response
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
};
