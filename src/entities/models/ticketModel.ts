import mongoose, { Model, Schema, Document } from "mongoose";
import { ITicket } from "../../interfaces/schema/ticketSchema";
import { ticketSeatCategorySchema } from "./subSchema/ticketSeatSchema";

export const ticketSchema: Schema = new Schema<ITicket & Document>({
    showId: {
        type: Schema.Types.ObjectId,
        required: [true, 'showId is required'],
        ref: 'Shows'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: [true, 'movieId is required'],
        ref: 'Movies'
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        required: [true, 'theaterId is required'],
        ref: 'Theaters'
    },
    screenId: {
        type: Schema.Types.ObjectId,
        required: [true, 'screenId is required'],
        ref: 'Screens'
    },
    seats: {
        type: [Schema.Types.Mixed] as any[],
        required: true
    },
    diamondSeats: ticketSeatCategorySchema,
    goldSeats: ticketSeatCategorySchema,
    silverSeats: ticketSeatCategorySchema,
    totalPrice: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    adminShare: {
        type: Number,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Stripe'],
        default: 'Stripe',  // Delete after Implementation
        required: true
    }
},
    {
        timestamps: true
    })

export const ticketModel: Model<ITicket & Document> = mongoose.model<ITicket & Document>('Tickets', ticketSchema)