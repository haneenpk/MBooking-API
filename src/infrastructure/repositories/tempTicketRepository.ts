import { tempTicketModel } from "../../entities/models/temp/tempTicketModel";
import { ID } from "../../interfaces/common";
import { ITempTicketRepo } from "../../interfaces/repos/tempTicketRepo";
import { ITempTicketRes, ITempTicketReqs, Seats } from "../../interfaces/schema/ticketSchema";

export class TempTicketRepository implements ITempTicketRepo {
    async saveTicketDataTemporarily (ticketData: any): Promise<ITempTicketRes> {
        return await new tempTicketModel(ticketData).save()
    }

    async getTicketData (ticketId: ID): Promise<any> {
        return await tempTicketModel.findById(ticketId).populate('showId')
    }

    async findTempTicketById (ticketId: ID): Promise<ITempTicketRes | null> {
        return await tempTicketModel.findById(ticketId).select({ _id: 0, expireAt: 0 }).populate('movieId')
        .populate('showId').populate('screenId').populate('theaterId')
    }

    // async getTicketDataWithoutPopulate (ticketId: string): Promise<ITempTicketRes | null> {
    //     return await tempTicketModel.findByIdAndDelete(ticketId).select({ _id: 0, expireAt: 0 }) as ITempTicketRes
    // }

    // async getHoldedSeats (showId: string): Promise<Seats> {
    //     return await tempTicketModel.find({ showId }, { _id: 0, diamondSeats: 1, goldSeats: 1, silverSeats: 1 })
    // }
}