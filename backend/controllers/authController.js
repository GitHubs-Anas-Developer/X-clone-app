const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Signup Controller
const signup = async (req, res) => {
  try {
    const { userName, fullName, email, password } = req.body;
    console.log(userName, fullName, email, password );
    

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email or username already exists
    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });
    if (existingEmail || existingUserName) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    // Check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      userName,
      fullName,
      email,
      password: hashPassword,
    });

    // Save user and generate token
    await newUser.save();
    const token = generateToken(newUser._id, res); // Generate token after saving user

    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(`Error in signup controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate token if login is successful
    const token = generateToken(user._id, res); // Generate token

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Return token in the response
    });
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // Clear the cookie
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`Error in logout controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Info Controller
const getme = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error in getme controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, getme };
