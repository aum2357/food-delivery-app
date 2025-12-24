import mongoose from "mongoose";
import "dotenv/config";
import userModel from "./models/userModel.js";

const viewUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to Database\n");
    
    const users = await userModel.find({}, { password: 0 }); // Exclude password
    
    console.log(`📊 Total Users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Cart Items: ${Object.keys(user.cartData).length}`);
      console.log("---");
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

viewUsers();
