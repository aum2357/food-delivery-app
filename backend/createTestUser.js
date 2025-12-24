import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import userModel from "./models/userModel.js";

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to Database\n");
    
    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    };
    
    // Check if user already exists
    const exists = await userModel.findOne({ email: testUser.email });
    if (exists) {
      console.log("❌ User already exists with this email");
      mongoose.connection.close();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    // Create user
    const newUser = new userModel({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword,
      role: "user"
    });
    
    await newUser.save();
    
    console.log("✅ User created successfully!");
    console.log(`📧 Email: ${testUser.email}`);
    console.log(`🔑 Password: ${testUser.password}`);
    console.log(`👤 Name: ${testUser.name}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestUser();
