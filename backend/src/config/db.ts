import mongoose from "mongoose";
import { env } from "@/config/envConfig";
const MONGO_URI = env.MONGO_URI || "";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
