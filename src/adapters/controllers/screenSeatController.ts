import { Request, Response } from "express";
import { ScreenSeatUseCase } from "../../useCases/screenSeatUseCase";
import { ID } from "../../interfaces/common";
import { IScreenSeatRes } from "../../interfaces/schema/screenSeatSchema";

export class ScreenSeatController {
    constructor(
      private readonly screenSeatUseCase: ScreenSeatUseCase
    ) { }

    async findScreenSeatById (req: Request, res: Response) {
        const screenSeatId = req.params.seatId as unknown as ID
        const screenSeatRes = await this.screenSeatUseCase.findScreenSeatById(screenSeatId)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }

    async updateScreenSeat (req: Request, res: Response) {
        const screenSeatId = req.params.seatId as unknown as ID
        const { screenData } = req.body as { screenData: IScreenSeatRes }
        
        const screenSeatRes = await this.screenSeatUseCase.updateScreenSeat(screenSeatId, screenData)
        res.status(screenSeatRes.status).json(screenSeatRes)
    }

}