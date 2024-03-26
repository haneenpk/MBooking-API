import mongoose, { Schema, Document, Model } from "mongoose";
import { ITheater } from "../../interfaces/schema/theaterSchema";
import { mobileSchema } from "./base/mobileSchema";
import baseTheaterSchema from "./base/baseTheaterSchema";



const theaterSchema: Schema = new Schema<ITheater & Document>({
    profilePic: String,
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    screenCount: {
        type: Number,
        default: 0,
        required: true
    },
    subscriptionId: { 
        type: Schema.Types.ObjectId,
        ref: 'Subscriptions',
        required: true,
        unique: true,
        readonly: true
    }
},
{
    timestamps: true
})

theaterSchema.add(baseTheaterSchema)
theaterSchema.add(mobileSchema)

theaterSchema.index({ 'coords': '2dsphere' });
theaterSchema.index({ name: 'text' });

export const theaterModel: Model<ITheater & Document> = mongoose.model<ITheater & Document>('Theaters', theaterSchema)


