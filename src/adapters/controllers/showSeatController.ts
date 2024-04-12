import { Request, Response } from "express";
import { ShowSeatUseCase } from "../../useCases/showSeatUseCase";
import { ID } from "../../interfaces/common";

export class ShowSeatController {
    constructor(
      private readonly showSeatUseCase: ShowSeatUseCase
    ) { }

    async findShowSeatById (req: Request, res: Response) {
        const showSeatId = req.params.seatId as unknown as ID
        const showSeatRes = await this.showSeatUseCase.findShowSeatById(showSeatId)
        res.status(showSeatRes.status).json(showSeatRes)
    }

}