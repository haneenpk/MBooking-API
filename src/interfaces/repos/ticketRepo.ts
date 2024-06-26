import { ISaveRequestReqs, ITicketRes } from "../schema/ticketSchema"

export interface ITicketRepo {
    saveTicket (tempTicket: any): Promise<ITicketRes>
    findTicketById (ticketId: string): Promise<ITicketRes | null>
    getTicketData (ticketId: string): Promise<ITicketRes | null>
    getTicketsByUserId (userId: string): Promise<ITicketRes[]>
    getTicketsByTheaterId (theaterId: string): Promise<ITicketRes[]>
    getTicketsAll (): Promise<ITicketRes[]>
    getTicketsOfTheaterByTime (theaterId: string, startDate: Date, endDate: Date): Promise<ITicketRes[]>
    findTicketsByTime (startDate: Date, endDate: Date): Promise<ITicketRes[]>
    getTicketsByTheaterIdCount(theaterId: string): Promise<number>
    getTicketsByShowId (showId: string): Promise<ITicketRes[]>
    getAllTickets (page: number, limit: number): Promise<ITicketRes[]>
    getAllTicketsCount(): Promise<number>
    cancelTicket (ticketId: string): Promise<ITicketRes | null>
}