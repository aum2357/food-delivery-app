import mongoose from "mongoose";
import "dotenv/config";

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to Database\n");
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📁 Database Name: ${dbName}`);
    console.log(`🔗 Connection String: ${process.env.MONGO_URL}\n`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Collections in database "${dbName}":`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Count users
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`\n👥 Total users in 'users' collection: ${userCount}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkDatabase();
