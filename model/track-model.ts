import { model, Schema } from "mongoose";
interface ITrack {
    trackingId: string;
    opens: number;
    userActions: {
        email: string;
        ip: string;
    }[];
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
    userActions: [{
        email: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        }
    }]

})
//might be a error if run on edge case
const Track = model<ITrack>("Track", trackSchema);
export default Track