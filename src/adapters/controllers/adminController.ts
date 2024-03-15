import { Request, Response } from "express";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { IAdmin } from "../../interfaces/schema/adminSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { UserUseCase } from "../../useCases/userUseCase";
// import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ID } from "../../interfaces/common";

export class AdminController {
    constructor(
        private readonly adminUseCase: AdminUseCase,
        private readonly userUseCase: UserUseCase,
    ) { }

    async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body as IAdmin
        const authData = await this.adminUseCase.verifyLogin(email, password)
        res.status(authData.status).json(authData)
    }

    async getAllUsers(req: Request, res: Response) {
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)
        const searchQuery = req.query.searchQuery as string | undefined
        const apiRes = await this.userUseCase.getAllUsers(page, limit, searchQuery)
        res.status(apiRes.status).json(apiRes)
    }

    async blockUser(req: Request, res: Response) {
        const apiRes = await this.userUseCase.blockUser(req.params.userId as string)
        res.status(apiRes.status).json(apiRes)
    }

    // async blockTheater(req: Request, res: Response) {
    //     const apiRes = await this.theaterUseCase.blockTheater(req.params.theaterId as string)
    //     res.status(apiRes.status).json(apiRes)
    // }

}