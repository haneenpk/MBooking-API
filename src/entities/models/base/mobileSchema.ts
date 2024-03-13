import { Schema, Document } from "mongoose";

export const mobileSchema: Schema = new Schema<{ mobile: string } & Document>({
    mobile: {
        type: String,
        unique: true,
        sparse: true,
    }
})