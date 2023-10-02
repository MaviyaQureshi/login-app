const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
