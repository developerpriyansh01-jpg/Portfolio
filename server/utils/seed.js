require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "developer.priyansh01@gmail.com" });
    
    if (adminExists) {
      console.log("Admin user already exists. Updating password...");
      adminExists.password = "Priyansh102012";
      await adminExists.save();
      console.log("Password updated!");
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      name: "Priyansh Rajput",
      email: "developer.priyansh01@gmail.com",
      password: "Priyansh102012",
      role: "admin",
    });

    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();

