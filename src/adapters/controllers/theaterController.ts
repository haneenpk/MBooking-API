import { Request, Response } from "express";
import { ITheaterAuth, ITheaterUpdate } from "../../interfaces/schema/theaterSchema";
import { TheaterUseCase } from "../../useCases/theaterUseCase";
import { ID, ITheaterAddress } from "../../interfaces/common";
import { ITempTheaterReq } from "../../interfaces/schema/tempTheaterSchema";

export class TheaterController {
    constructor(
        private readonly theaterUseCase: TheaterUseCase
    ) { }

    // To save non-verified theater data temporarily and send otp for verification
    async theaterRegister(req: Request, res: Response) {
        const { name, email, mobile, password } = req.body as ITheaterAuth
        const { country, state, district, city } = req.body as ITheaterAddress

        const address: ITheaterAddress = { country, state, district, city }

        const theaterData: ITempTheaterReq = { name, email, mobile, password, address, otp: 0 }

        const authRes = await this.theaterUseCase.verifyAndSaveTemporarily(theaterData)
        res.status(authRes.status).json(authRes)
    }

    // To validate otp during registration
    async validateTheaterOTP(req: Request, res: Response) {
        const { otp, email } = req.body
        const validationRes = await this.theaterUseCase.validateAndSaveTheater(otp , email)
        res.status(validationRes.status).json(validationRes)
    }

    // To resend otp if current one is already expired
    async resendOTP(req:Request, res: Response) {
        
        // const authToken = req.headers.authorization;
        const { email } = req.body
        const apiRes = await this.theaterUseCase.verifyAndSendNewOTP(email)
        res.status(apiRes.status).json(apiRes)
    }

    // To authenticate theater login using email and password
    async theaterLogin(req: Request, res: Response) {
        const { email, password } = req.body as ITheaterAuth
        const authData = await this.theaterUseCase.verifyLogin(email, password)
        res.status(authData.status).json(authData)
    }

    // to update a theater data, used in profile edit
    async updateTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const { address, mobile, name } = req.body as ITheaterUpdate
        const theater: ITheaterUpdate = { name, mobile, address }
        const apiRes = await this.theaterUseCase.updateTheater(theaterId, theater)
        res.status(apiRes.status).json(apiRes)
    }

    // To get all the data of a theater using theater id
    async getTheaterData(req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as ID
        const apiRes = await this.theaterUseCase.getTheaterData(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async getAllTheater(req: Request, res: Response) {
        const apiRes = await this.theaterUseCase.getAllTheater()
        res.status(apiRes.status).json(apiRes)
    }

}