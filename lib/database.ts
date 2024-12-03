import { config } from "dotenv";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MongoDB URI missing");
  process.exit(1);
}

export const connectToDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};