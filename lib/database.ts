import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.local" });

const nodeEnv = process.env.NODE_ENV || "development";
const uri = nodeEnv === "development" ? process.env.MONGODB_URI_LOCAL : process.env.MONGODB_URI_PROD;

if (!uri) {
    console.error("MongoDB URI missing");
    process.exit(1);
}

export const connectToDB = async () => {
    try {
        await mongoose.connect(uri, { dbName: uri.includes("local") ? "test" : "muse-prod" });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export const connectToUri = async (uri: string) => {
    try {
        await mongoose.connect(uri, { dbName: uri.includes("local") ? "test" : "muse-prod" });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}