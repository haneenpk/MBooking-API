import { ITicketSeat } from "../schema/ticketSchema"
import { IShowSeatToSave, IShowSeatsRes } from "../schema/showSeatSchema"

export interface IShowSeatRepo {
    saveShowSeat(showSeat: Partial<IShowSeatToSave>): Promise<IShowSeatsRes>
    findShowSeatById(showSeatId: string): Promise < IShowSeatsRes | null>
    markAsBooked (seatId: string, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null>
    markAsNotBooked  (seatId: string, diamondSeats?: ITicketSeat, goldSeats?: ITicketSeat, silverSeats?: ITicketSeat): Promise<IShowSeatsRes | null>
}