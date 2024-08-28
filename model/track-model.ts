// import { model, Schema, Document } from "mongoose";

// interface ITrack extends Document {
//     trackingId: string;
//     senderEmail: string;
//     senderIP: string;
//     receiverEmail: string;
//     receiverIP: string;
//     opens: number;
// }

// const trackSchema = new Schema<ITrack>({
//     trackingId: {
//         type: String,
//         required: true,
//         unique: true, // Ensure trackingId is unique in the collection
//     },
//     senderEmail: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true, // Ensure email is stored in lowercase
//     },
//     senderIP: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     receiverEmail: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//     },
//     receiverIP: {
//         type: String,
//         default: "0.0.0.0", // Initialized as 0.0.0.0 and updated when the receiver opens the email
//         trim: true,
//     },
//     opens: {
//         type: Number,
//         default: 0, // Default to 0 and increment each time the receiver opens the email
//         min: 0,
//     },
// }, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

// const Track = model<ITrack>("Track", trackSchema);
// export default Track;
import { model, Schema } from "mongoose";
interface ITrack {
    trackingId: string;
    opens: number;
    userIPs: string[];
}

const trackSchema = new Schema<ITrack>({
    trackingId: {
        type: String,
        required: true
    },
    opens: {
        type: Number,
        default: 0
    },
    userIPs: {
        type: [String],
        required: true
    }

})
//might be a error if run on edge case
const Track = model<ITrack>("Track", trackSchema);
export default Track