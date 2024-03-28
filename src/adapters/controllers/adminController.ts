import { Request, Response } from "express";
import { AdminUseCase } from "../../useCases/adminUseCase";
import { IAdmin, IAdminUpdate } from "../../interfaces/schema/adminSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { UserUseCase } from "../../useCases/userUseCase";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ID } from "../../interfaces/common";

export class AdminController {
    constructor(
        private readonly adminUseCase: AdminUseCase,
        private readonly userUseCase: UserUseCase,
        private readonly theaterUseCase: TheaterUseCase,
    ) { }

    async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body as IAdmin

        const authData = await this.adminUseCase.verifyLogin(email, password)

        res.status(authData.status).json(authData)
    }

    async getAdminData(req: Request, res: Response) {
        const adminId: ID = req.params.adminId as unknown as ID
        const apiRes = await this.adminUseCase.getAdminData(adminId)

        res.status(apiRes.status).json(apiRes)
    }

    // To update user details from profile
    async updateProfile(req: Request, res: Response) {
        const admin = req.body as IAdminUpdate
        const adminId: ID = req.params.adminId as unknown as ID
        const apiRes = await this.adminUseCase.updateAdminData(adminId, admin)

        res.status(apiRes.status).json(apiRes)
    }

    async getUsers(req: Request, res: Response) {
        const apiRes = await this.userUseCase.getUsers()
        res.status(apiRes.status).json(apiRes)
    }

    async blockUser(req: Request, res: Response) {
        const apiRes = await this.userUseCase.blockUser(req.params.userId as string)
        res.status(apiRes.status).json(apiRes)
    }

    async getTheaters(req: Request, res: Response) {
        const apiRes = await this.theaterUseCase.getTheaters()
        res.status(apiRes.status).json(apiRes)
    }

    async blockTheater(req: Request, res: Response) {
        const apiRes = await this.theaterUseCase.blockTheater(req.params.theaterId as string)
        res.status(apiRes.status).json(apiRes)
    }

}