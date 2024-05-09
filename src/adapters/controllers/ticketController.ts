import { Request, Response } from "express";
import { ITempTicketReqs } from "../../interfaces/schema/ticketSchema";
import { TicketUseCase } from "../../useCases/ticketUseCase";
import { CancelledBy, PaymentMethod } from "../../interfaces/common";
import { ID } from "../../interfaces/common";

export class TicketController {
    constructor (
        private readonly ticketUseCase: TicketUseCase
    ) {}

    async holdSeats (req: Request, res: Response) {
        const apiRes = await this.ticketUseCase.holdSeats(req.body.seatId, req.body.selectedSeats, req.body.showId, req.body.userId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTempTicket (req: Request, res: Response) {
        const tempTicketId = req.params.tempTicketId as unknown as ID
        const apiRes = await this.ticketUseCase.getTempTicket(tempTicketId)
        res.status(apiRes.status).json(apiRes)
    }

    async confirmTicket (req: Request, res: Response) {
        const tempTicketId = req.params.tempTicketId as unknown as ID
        const payment = req.query.payment as unknown as string
        const apiRes = await this.ticketUseCase.confirmTicket(tempTicketId, payment)
        res.status(apiRes.status).json(apiRes)
    }

    async saveTicket (req: Request, res: Response) {
        const tempTicketId = req.params.tempTicketId as unknown as ID
        const apiRes = await this.ticketUseCase.saveTicket(tempTicketId)
        res.status(apiRes.status).json(apiRes)
    }

    async userTicketHistory (req: Request, res: Response) {
        const userId = req.params.userId as unknown as string
        const apiRes = await this.ticketUseCase.userTicketHistory(userId)
        res.status(apiRes.status).json(apiRes)
    }

    async cancelTicket (req: Request, res: Response) {
        const ticketId = req.params.ticketId as unknown as string
        const apiRes = await this.ticketUseCase.cancelTicket(ticketId)
        res.status(apiRes.status).json(apiRes)
    }

    async getTicketsTheaters (req: Request, res: Response) {
        const theaterId = req.params.theaterId as unknown as string
        const apiRes = await this.ticketUseCase.getTicketsTheaters(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async getAllTickets (req: Request, res: Response) {
        const apiRes = await this.ticketUseCase.getAllTickets()
        res.status(apiRes.status).json(apiRes)
    }

    async getChartData (req: Request, res: Response) {        
        const theaterId = req.params.theaterId as unknown as string
        const apiRes = await this.ticketUseCase.getChartData(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async getAllChartData (req: Request, res: Response) {        
        const apiRes = await this.ticketUseCase.getAllChartData()
        res.status(apiRes.status).json(apiRes)
    }

    // async bookTicket (req: Request, res: Response) {
    //     const ticketReqs: ITempTicketReqs = req.body.ticketReqs
    //     const apiRes = await this._ticketUseCase.bookTicketDataTemporarily(ticketReqs)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getHoldedSeats (req: Request, res: Response) { 
    //     const showId = req.params.showId
    //     const apiRes = await this._ticketUseCase.getHoldedSeats(showId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getTicketData (req: Request, res: Response) { 
    //     const ticketId = req.params.ticketId
    //     const apiRes = await this._ticketUseCase.getTicketData(ticketId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getTempTicketData (req: Request, res: Response) { 
    //     const ticketId = req.params.ticketId
    //     const apiRes = await this._ticketUseCase.getTempTicketData(ticketId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async confirmTicket (req: Request, res: Response) { 
    //     const tempTicketId = req.body.ticketId
    //     const couponId = req.body.couponId
    //     const paymentMethod = req.body.paymentMethod as PaymentMethod
    //     const useWallet = Boolean(req.body.useWallet)
    //     const apiRes = await this._ticketUseCase.confirmTicket(tempTicketId, paymentMethod, useWallet, couponId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getTicketsOfUser (req: Request, res: Response) { 
    //     const userId = req.params.userId
    //     const apiRes = await this._ticketUseCase.getTicketsOfUser(userId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getTicketsOfShow (req: Request, res: Response) { 
    //     const showId = req.params.showId
    //     const apiRes = await this._ticketUseCase.getTicketsOfShow(showId)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async cancelTicket (req: Request, res: Response) {
    //     const ticketId = req.params.ticketId
    //     const cancelledBy = req.body.cancelledBy as unknown as CancelledBy 
    //     const apiRes = await this._ticketUseCase.cancelTicket(ticketId, cancelledBy)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getTicketsOfTheater (req: Request, res: Response) {
    //     const theaterId = req.params.theaterId
    //     const page = parseInt(req.query.page as string)
    //     const limit = parseInt(req.query.limit as string)
    //     const apiRes = await this._ticketUseCase.getTicketsOfTheater(theaterId, page, limit)
    //     res.status(apiRes.status).json(apiRes)
    // }

    // async getAllTickets (req: Request, res: Response) {
    //     const page = parseInt(req.query.page as string)
    //     const limit = parseInt(req.query.limit as string)
    //     const apiRes = await this._ticketUseCase.getAllTickets(page, limit)
    //     res.status(apiRes.status).json(apiRes)
    // }

}