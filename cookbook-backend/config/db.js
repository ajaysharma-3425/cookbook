import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // ✅ serverless safe check (multiple connections se bachne ke liye)
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    // ❌ process.exit(1) MAT use karo (Vercel crash ho jata hai)
  }
};

export default connectDB;
