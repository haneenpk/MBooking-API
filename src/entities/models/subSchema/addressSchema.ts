import { Schema, Document } from "mongoose";
import { ITheaterAddress, IUserAddress } from "../../../interfaces/common";
import { ZipRegex } from "../../../constants/constants";

export const userAddressSchema: Schema = new Schema<IUserAddress & Document>({
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    district: {
        type: String,
        required: [true, 'District is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
})

export const theaterAddressSchema: Schema = new Schema<ITheaterAddress & Document>({
    ...userAddressSchema.obj,
    landmark: String,
})