const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db is connected");
  } catch (error) {
    console.log(`Error  in connecting db ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
