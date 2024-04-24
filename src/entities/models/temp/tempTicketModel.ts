import mongoose, { Schema, Model, Document } from "mongoose"
import { ITempTicketRes } from "../../../interfaces/schema/ticketSchema"
import { ticketSchema } from "../ticketModel"

const tempTicketSchema: Schema = new Schema<ITempTicketRes & Document>({
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10 // expires after 10 mins
    }
})

tempTicketSchema.add(ticketSchema)

export const tempTicketModel: Model<ITempTicketRes & Document> = mongoose.model<ITempTicketRes & Document>('TempTickets', tempTicketSchema)