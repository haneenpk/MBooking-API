import mongoose, { Schema, Model, Document } from "mongoose";
import { showSingleSeatSchema } from "./subSchema/showSeatSchema";
import { IShowSeatCategory, IShowSeats } from "../../interfaces/schema/showSeatSchema";

export const showSeatCatSchema: Schema = new Schema<IShowSeatCategory & Document>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    seats: {
        type: Map,
        of: [showSingleSeatSchema]
    }
});


export const showSeatsSchema: Schema = new Schema<IShowSeats & Document>({
    diamond: showSeatCatSchema,
    gold: showSeatCatSchema,
    silver: showSeatCatSchema,
})

export const showSeatsModel: Model<IShowSeats & Document> = mongoose.model<IShowSeats & Document>('ShowSeats', showSeatsSchema)