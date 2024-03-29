import mongoose, { Schema, Document, Model } from "mongoose";;
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { emailSchema } from "./base/emailSchema";

const adminSchema: Schema = new Schema<IAdmin & Document>({
    name: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

adminSchema.add(emailSchema)

export const adminModel: Model< IAdmin & Document> = mongoose.model< IAdmin & Document>('Admin', adminSchema)