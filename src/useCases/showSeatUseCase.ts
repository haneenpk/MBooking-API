import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ShowSeatRepository } from "../infrastructure/repositories/showSeatRepository";
import { ID } from "../interfaces/common";
import { IApiShowSeatRes } from "../interfaces/schema/showSeatSchema";

export class ShowSeatUseCase {
    constructor(
        private readonly showSeatRepository: ShowSeatRepository,
    ) { }

    async findShowSeatById(showSeatId: ID): Promise<IApiShowSeatRes> {
        try {
            const showSeat = await this.showSeatRepository.findShowSeatById(showSeatId)
            if (showSeat) return get200Response(showSeat)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Screen Id missing')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}