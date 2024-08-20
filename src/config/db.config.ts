import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI as string);
        console.log("mongodb connected succesfully!");

    }
    catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}