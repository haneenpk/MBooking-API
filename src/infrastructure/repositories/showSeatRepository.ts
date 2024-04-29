import { showSeatsModel } from "../../entities/models/showSeatModel";
import { ID } from "../../interfaces/common";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatSchema";


export class ShowSeatRepository { // implements IChatRepo

    // Save new seat document for each show newly created
    async saveShowSeat (showSeat: Partial<IShowSeatToSave>): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    // To get the document using _id
    async findShowSeatByIdS (showSeatId: string): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

    async findShowSeatById (showSeatId: ID): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

    async udateShowSeatById(showSeatId: ID, showSeat: any) {
        return await showSeatsModel.updateOne({ _id: showSeatId }, { $set: showSeat });
    }

    async udateShowSeatByIdS(showSeatId: string, showSeat: any) {
        return await showSeatsModel.updateOne({ _id: showSeatId }, { $set: showSeat });
    }

}