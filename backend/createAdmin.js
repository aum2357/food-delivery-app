import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import userModel from "./models/userModel.js";

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to Database\n");
    
    const adminUser = {
      name: "Admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      role: "admin"
    };
    
    // Check if admin already exists
    const exists = await userModel.findOne({ email: adminUser.email });
    if (exists) {
      console.log("❌ Admin user already exists with this email");
      
      // Update existing user to admin role
      await userModel.findOneAndUpdate(
        { email: adminUser.email },
        { role: "admin" }
      );
      console.log("✅ User role updated to admin");
      mongoose.connection.close();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create admin user
    const newUser = new userModel({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: "admin"
    });
    
    await newUser.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`👑 Role: ${adminUser.role}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  Save these credentials! You'll need them to login to the admin panel.");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminUser();
