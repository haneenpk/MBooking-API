import { Schema, Document } from "mongoose";
import { ITicketSeat } from "../../../interfaces/schema/ticketSchema";

export const ticketSeatCategorySchema: Schema = new Schema<ITicketSeat & Document>({
    seatCount: {
        type: Number,
        required: true
    },
    singlePrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        requied: true
    }
})