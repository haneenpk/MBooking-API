import mongoose, { Model, Schema, Document } from "mongoose";
import { ITempUserRes } from "../../../interfaces/schema/tempUserSchema";
import { emailSchema } from "../base/emailSchema";
import { mobileSchema } from "../base/mobileSchema";


const tempUserSchema: Schema = new Schema<ITempUserRes & Document>({
    username:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        // min: 1000,
        // max: 9999
    },
    password: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15 // expires after 15 mins
    }
})

tempUserSchema.add(emailSchema)
tempUserSchema.add(mobileSchema)
tempUserSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });


export const tempUserModel: Model<ITempUserRes & Document> = mongoose.model<ITempUserRes & Document>('TempUsers', tempUserSchema)