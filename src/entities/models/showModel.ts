import mongoose, { Model, Schema, Document } from "mongoose";
import { IScreenSeatCategory, IScreenSeat } from "../../interfaces/schema/screenSeatSchema";

export function getScreenSeatCategorySchema(){
    return new Schema({
        price: {
          type: String,
          required: true,
        },
        seats: {
          type: Map,
          of: [Number],
        },
    });
}

export const screenSeatSchema: Schema = new Schema({
    diamond: getScreenSeatCategorySchema(),
    gold: getScreenSeatCategorySchema(),
    silver: getScreenSeatCategorySchema(),
})

export const screenSeatModel = mongoose.model('ScreenSeats', screenSeatSchema)