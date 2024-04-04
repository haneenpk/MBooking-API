import { Request, Response } from "express";
import { ShowUseCase } from "../../useCases/showUseCase";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";

export class ShowController {
    constructor(
        private readonly showUseCase: ShowUseCase,
    ) { }

    async addShow(req: Request, res: Response) {
        const showReqs = req.body
        const apiRes = await this.showUseCase.addShow(showReqs)
        res.status(apiRes.status).json(apiRes)
    }

    // To find all the shows on a theater on a specific day
    async findShowsOnTheater(req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const date = req.query.date as string | undefined
        const apiRes = await this.showUseCase.findShowsOnTheater(theaterId, date, 'Theater')
        // res.status(apiRes.status).json(apiRes)
    }

}

