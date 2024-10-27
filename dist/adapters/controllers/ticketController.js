"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
class TicketController {
    constructor(ticketUseCase) {
        this.ticketUseCase = ticketUseCase;
    }
    holdSeats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.ticketUseCase.holdSeats(req.body.seatId, req.body.selectedSeats, req.body.showId, req.body.userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTempTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempTicketId = req.params.tempTicketId;
            const apiRes = yield this.ticketUseCase.getTempTicket(tempTicketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    confirmTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempTicketId = req.params.tempTicketId;
            const payment = req.query.payment;
            const apiRes = yield this.ticketUseCase.confirmTicket(tempTicketId, payment);
            res.status(apiRes.status).json(apiRes);
        });
    }
    saveTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempTicketId = req.params.tempTicketId;
            const apiRes = yield this.ticketUseCase.saveTicket(tempTicketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    userTicketHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.ticketUseCase.userTicketHistory(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    cancelTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketId = req.params.ticketId;
            const apiRes = yield this.ticketUseCase.cancelTicket(ticketId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTicketsTheaters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.ticketUseCase.getTicketsTheaters(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAllTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.ticketUseCase.getAllTickets();
            res.status(apiRes.status).json(apiRes);
        });
    }
    getChartData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.ticketUseCase.getChartData(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAllChartData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.ticketUseCase.getAllChartData();
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.TicketController = TicketController;
