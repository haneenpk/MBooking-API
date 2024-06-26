import { ColType, IApiRes, ID, PaymentMethod, RowType } from "../common";

export interface ITicketSeat {
    seatCount: number
    singlePrice: number
    totalPrice: number
}

export interface ITicket {
    _id: string
    showId: ID
    userId: ID
    screenId: ID
    movieId: ID
    theaterId: ID
    seats: any[]
    diamondSeats: ITicketSeat
    goldSeats: ITicketSeat
    silverSeats: ITicketSeat
    totalPrice: number
    total: number
    adminShare: number
    seatCount: number
    startTime: Date
    isCancelled: boolean
    cancelledBy?: 'User' | 'Theater' | 'Admin'
    paymentMethod: 'Wallet' | 'Stripe',
}

export interface ISelectedSeat {
    row: string
    col: number
}

export type SeatRes = {
    [Key in RowType]?: ColType[];
};

export interface ITempTicket extends Omit<ITicket, 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {
    expireAt: Date
}
export interface ISaveRequestReqs extends ITempTicket {
    paymentMethod: PaymentMethod
}
export interface ITempTicketRes extends ITempTicket {}
export interface IApiTempTicketRes extends IApiRes<ITempTicketRes | null> {}
export interface IApiTempTicketsRes extends IApiRes<ITempTicketRes[]> {}

export interface ITempTicketReqs extends Omit<ITicket, '_id' | 'isCancelled' | 'cancelledBy' | 'paymentMethod'> {}


export interface ITicketReqs extends Omit<ITicket, '_id' | 'isCancelled' > {}

export interface ITicketRes extends ITicket {
    createdAt: Date
    updatedAt: Date
}
export interface IApiTicketRes extends IApiRes<ITicketRes | null> {}
export interface IApiTicketsRes extends IApiRes<ITicketRes[] | null> {}

export type Seats = Map<string, number[]>[]
export interface IApiSeatsRes extends IApiRes<Seats | null> {}

export interface ITicketsAndCount {
    tickets: ITicketRes[]
    ticketCount: number
}