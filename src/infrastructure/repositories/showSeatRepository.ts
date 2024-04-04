import { showSeatsModel } from "../../entities/models/showSeatModel";
import { IShowSeatToSave, IShowSeatsRes } from "../../interfaces/schema/showSeatSchema";


export class ShowSeatsRepository { // implements IChatRepo

    // Save new seat document for each show newly created
    async saveShowSeat (showSeat: Partial<IShowSeatToSave>): Promise<IShowSeatsRes> {
        return await new showSeatsModel(showSeat).save() as unknown as IShowSeatsRes
    }

    // To get the document using _id
    async findShowSeatById (showSeatId: string): Promise<IShowSeatsRes | null> {
        return await showSeatsModel.findById(showSeatId)
    }

}