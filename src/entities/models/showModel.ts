import mongoose, { Model, Schema, Document } from "mongoose";
import { IShow } from "../../interfaces/schema/showSchema";

interface IShowSchema extends Omit<IShow, 'movieId' | 'screenId' | 'seatId'> {
    movieId: Schema.Types.ObjectId,
    screenId: Schema.Types.ObjectId,
    seatId: Schema.Types.ObjectId,
}

export const showSchema: Schema = new Schema<IShowSchema>({
    theaterId: {
        type: Schema.Types.ObjectId,
        ref: 'Theaters',
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movies',
        required: true
    },
    screenId: {
        type: Schema.Types.ObjectId,
        ref: 'Screens',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        }
    },
    endTime: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        }
    },
    totalSeatCount: {
        type: Number,
        required: true
    },
    availableSeatCount: {
        type: Number,
        required: true
    },
    seatId: {
        type: Schema.Types.ObjectId,
        ref: 'ShowSeats',
        required: true,
        unique: true,
        // immutable: [true, 'Changing seatId is forbidden']
    }
})

export const showModel: Model<IShowSchema & Document> = mongoose.model<IShowSchema & Document>('Shows', showSchema)
