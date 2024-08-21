import { model, Schema, Document } from "mongoose";

interface IUserAction {
    email: string;
    ip: string;
}

interface ITrack extends Document {
    trackingId: string;
    opens: number;
    userActions: IUserAction[];
}

const userActionSchema = new Schema<IUserAction>({
    email: {
        type: String,
        required: true,
        trim: true, // Added trimming to remove accidental whitespace
        lowercase: true, // Ensure email is stored in lowercase
    },
    ip: {
        type: String,
        required: true,
        trim: true, // Added trimming to remove accidental whitespace
    },
});

const trackSchema = new Schema<ITrack>({
    trackingId: {
        type: String,
        required: true,
        unique: true, // Ensure trackingId is unique in the collection
    },
    opens: {
        type: Number,
        default: 0,
        min: 0, // Ensuring the opens count cannot go below 0
    },
    userActions: {
        type: [userActionSchema], // Embedded schema for user actions
        default: [], // Default to an empty array to avoid undefined errors
    },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

const Track = model<ITrack>("Track", trackSchema);
export default Track;
