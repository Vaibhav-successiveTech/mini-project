import dotenv from "dotenv";;
import mongoose from "mongoose";
dotenv.config();
const connectDb = async () => {
    const URL = process.env.MONGO_URI;
    try {
        await mongoose.connect(URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default connectDb;