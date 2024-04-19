import { Request, Response } from "express";
import { ChatUseCase } from "../../useCases/chatUseCase";
import { IChatReadReqs, IChatReqs } from "../../interfaces/schema/chatSchema";

export class ChatController {
    constructor(
        private readonly chatUseCase: ChatUseCase
    ) { }

    async getChatHistory (req: Request, res: Response) {
        const { userId, theaterId } = req.query as unknown as IChatReqs
        console.log(req.query);
        
        const apiRes = await this.chatUseCase.getChatHistory(userId, theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTheatersChattedWith (req: Request, res: Response) {
        const userId = req.params.userId
        const apiRes = await this.chatUseCase.getTheatersChattedWith(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getUsersChattedWith (req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const apiRes = await this.chatUseCase.getUsersChattedWith(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

}