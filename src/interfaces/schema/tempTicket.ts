import { ITicket } from "./ticketSchema";

export interface ITempTicket extends Omit<ITicket, 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {
    expireAt: Date
}