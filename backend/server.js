const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const dbConnect = require("./db/connectDB");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");
const notificationRoutes = require("./routes/notificationRoute");

dotenv.config(); // Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // Corrected: `api_Key` to `api_key`
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(
  express.json({
    limit: "5mb",
  })
); // Parse JSON requests
app.use(cookieParser());
app.use(
  express.urlencoded({
    urlencoded: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);



// Port from environment variables or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, async () => {
  try {
    await dbConnect(); // Connect to MongoDB
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error connecting to the database", error);
  }
});
