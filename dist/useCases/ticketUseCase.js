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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUseCase = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const stripe_1 = __importDefault(require("stripe"));
class TicketUseCase {
    constructor(ticketRepository, tempTicketRepository, showRepository, showSeatRepository, userRepository) {
        this.ticketRepository = ticketRepository;
        this.tempTicketRepository = tempTicketRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.userRepository = userRepository;
    }
    holdSeats(seatId, selectedSeat, showId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showSeat = yield this.showSeatRepository.findShowSeatById(seatId);
                const show = yield this.showRepository.findShowById(showId);
                const user = yield this.userRepository.findById(userId);
                // Check if showSeat, show, and user exist
                if (!showSeat || !show || !user) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'One or more required resources not found',
                        data: null,
                    };
                }
                let obj = {
                    showId: show._id,
                    userId: user._id,
                    movieId: show.movieId,
                    theaterId: show.theaterId,
                    screenId: show.screenId,
                    seats: selectedSeat,
                    diamondSeats: {
                        seatCount: 0,
                        singlePrice: showSeat.diamond.price,
                        totalPrice: 0
                    },
                    goldSeats: {
                        seatCount: 0,
                        singlePrice: showSeat.gold.price,
                        totalPrice: 0
                    },
                    silverSeats: {
                        seatCount: 0,
                        singlePrice: showSeat.silver.price,
                        totalPrice: 0
                    },
                    totalPrice: 0,
                    total: 0,
                    adminShare: 25,
                    seatCount: selectedSeat.length
                };
                for (let i = 0; i < selectedSeat.length; i++) {
                    let row = selectedSeat[i].seatNumber.slice(0, 1);
                    let seatNum = selectedSeat[i].seatNumber.slice(1);
                    if (selectedSeat[i].category === "diamond") {
                        obj.diamondSeats.seatCount += 1;
                        obj.diamondSeats.totalPrice += showSeat.diamond.price;
                        obj.totalPrice += showSeat.diamond.price;
                        obj.total = obj.total + showSeat.diamond.price + obj.adminShare;
                        const seatsInRow = showSeat.diamond.seats.get(row);
                        if (seatsInRow) {
                            for (let j = 0; j < seatsInRow.length; j++) {
                                const seat = seatsInRow[j];
                                if (seat.col === Number(seatNum)) {
                                    seat.isTempBooked = true;
                                    break;
                                }
                            }
                        }
                    }
                    else if (selectedSeat[i].category === "gold") {
                        obj.goldSeats.seatCount += 1;
                        obj.goldSeats.totalPrice += showSeat.gold.price;
                        obj.totalPrice += showSeat.gold.price;
                        obj.total = obj.total + showSeat.gold.price + obj.adminShare;
                        const seatsInRow = showSeat.gold.seats.get(row);
                        if (seatsInRow) {
                            for (let j = 0; j < seatsInRow.length; j++) {
                                const seat = seatsInRow[j];
                                if (seat.col === Number(seatNum)) {
                                    seat.isTempBooked = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        obj.silverSeats.seatCount += 1;
                        obj.silverSeats.totalPrice += showSeat.silver.price;
                        obj.totalPrice += showSeat.silver.price;
                        obj.total = obj.total + showSeat.silver.price + obj.adminShare;
                        const seatsInRow = showSeat.silver.seats.get(row);
                        if (seatsInRow) {
                            for (let j = 0; j < seatsInRow.length; j++) {
                                const seat = seatsInRow[j];
                                if (seat.col === Number(seatNum)) {
                                    seat.isTempBooked = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                const tempTicket = yield this.tempTicketRepository.saveTicketDataTemporarily(obj);
                const updated = yield this.showSeatRepository.udateShowSeatById(seatId, showSeat);
                // Set a timer to expire after 10 minutes
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    console.log("8 sec");
                    const showSeatNew = yield this.showSeatRepository.findShowSeatById(seatId);
                    if (!showSeatNew) {
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                            message: 'One or more required resources not found',
                            data: null,
                        };
                    }
                    for (let i = 0; i < selectedSeat.length; i++) {
                        let row = selectedSeat[i].seatNumber.slice(0, 1);
                        let seatNum = selectedSeat[i].seatNumber.slice(1);
                        if (selectedSeat[i].category === "diamond") {
                            const seatsInRow = showSeatNew.diamond.seats.get(row);
                            if (seatsInRow) {
                                for (let j = 0; j < seatsInRow.length; j++) {
                                    const seat = seatsInRow[j];
                                    if (seat.col === Number(seatNum)) {
                                        seat.isTempBooked = false;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (selectedSeat[i].category === "gold") {
                            const seatsInRow = showSeatNew.gold.seats.get(row);
                            if (seatsInRow) {
                                for (let j = 0; j < seatsInRow.length; j++) {
                                    const seat = seatsInRow[j];
                                    if (seat.col === Number(seatNum)) {
                                        seat.isTempBooked = false;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            const seatsInRow = showSeatNew.silver.seats.get(row);
                            if (seatsInRow) {
                                for (let j = 0; j < seatsInRow.length; j++) {
                                    const seat = seatsInRow[j];
                                    if (seat.col === Number(seatNum)) {
                                        seat.isTempBooked = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    // Update the showSeat in the database after expiring temporary bookings
                    yield this.showSeatRepository.udateShowSeatById(seatId, showSeatNew);
                }), 10 * 60 * 1000); // 10 minutes in milliseconds
                return (0, response_1.get200Response)(tempTicket);
            }
            catch (error) {
                // Handle error
                // return get500Response(error.message);
            }
        });
    }
    getTempTicket(tempTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tempTicket = yield this.tempTicketRepository.findTempTicketById(tempTicketId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: tempTicket,
                };
            }
            catch (error) {
                // return get500Response(error.message);
            }
        });
    }
    confirmTicket(tempTicketId, payment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tempTicket = yield this.tempTicketRepository.findTempTicketById(tempTicketId);
                if (!tempTicket) {
                    throw new Error('Temp ticket not found.');
                }
                if (payment === "Stripe") {
                    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
                    if (!stripeSecretKey) {
                        throw new Error('Stripe secret key is not defined in the environment variables.');
                    }
                    const stripe = new stripe_1.default(stripeSecretKey);
                    const customer = yield stripe.customers.create({
                        name: "Jhon",
                        address: {
                            city: "New York",
                            country: "US",
                            line1: "123 Main Street",
                            line2: "Apt 4b",
                            postal_code: "10001",
                            state: "NY",
                        },
                        metadata: {
                            userId: tempTicket.userId.toString(), // Assuming userId is of type ObjectId, convert it to string
                            courseId: tempTicket._id, // Assuming _id is of type ObjectId, convert it to string
                            price: tempTicket.totalPrice.toString(), // Convert totalPrice to string
                        },
                    });
                    const session = yield stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        mode: 'payment',
                        customer: customer.id,
                        success_url: `${process.env.CORS_URI}/booking/success?tempTicketId=${tempTicketId}`,
                        cancel_url: `${process.env.CORS_URI}/payment/`,
                        line_items: [
                            {
                                price_data: {
                                    currency: 'inr',
                                    unit_amount: ((_a = tempTicket.total) !== null && _a !== void 0 ? _a : 0) * 100,
                                    product_data: {
                                        name: tempTicket.seatCount ? `${tempTicket.seatCount} seats` : 'Unknown Seats'
                                    }
                                },
                                quantity: 1
                            }
                        ]
                    });
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        session, // Return the session object
                    };
                }
                else {
                    let user = yield this.userRepository.updateWallet(tempTicket.userId, -tempTicket.total, "Buy a Ticket");
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        user, // Return the session object
                    };
                }
            }
            catch (error) {
                console.error(error);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: 'Error confirming ticket',
                    error: error,
                };
            }
        });
    }
    saveTicket(tempTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempTicket = yield this.tempTicketRepository.getTicketData(tempTicketId);
            let obj = {
                showId: tempTicket.showId._id,
                userId: tempTicket.userId,
                movieId: tempTicket.movieId,
                theaterId: tempTicket.theaterId,
                screenId: tempTicket.screenId,
                seats: tempTicket.seats,
                diamondSeats: tempTicket.diamondSeats,
                goldSeats: tempTicket.goldSeats,
                silverSeats: tempTicket.silverSeats,
                totalPrice: tempTicket.totalPrice,
                total: tempTicket.total,
                adminShare: tempTicket.adminShare,
                seatCount: tempTicket.seatCount
            };
            const ticket = yield this.ticketRepository.saveTicket(obj);
            const updatedShow = yield this.showRepository.updatedAvailSeat(tempTicket.showId._id, -tempTicket.seatCount);
            const showSeat = yield this.showSeatRepository.findShowSeatById(tempTicket.showId.seatId);
            if (!showSeat) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: 'One or more required resources not found',
                    data: null,
                };
            }
            for (let i = 0; i < tempTicket.seats.length; i++) {
                let row = tempTicket.seats[i].seatNumber.slice(0, 1);
                let seatNum = tempTicket.seats[i].seatNumber.slice(1);
                if (tempTicket.seats[i].category === "diamond") {
                    const seatsInRow = showSeat.diamond.seats.get(row);
                    if (seatsInRow) {
                        for (let j = 0; j < seatsInRow.length; j++) {
                            const seat = seatsInRow[j];
                            if (seat.col === Number(seatNum)) {
                                seat.isBooked = true;
                                break;
                            }
                        }
                    }
                }
                else if (tempTicket.seats[i].category === "gold") {
                    const seatsInRow = showSeat.gold.seats.get(row);
                    if (seatsInRow) {
                        for (let j = 0; j < seatsInRow.length; j++) {
                            const seat = seatsInRow[j];
                            if (seat.col === Number(seatNum)) {
                                seat.isBooked = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    const seatsInRow = showSeat.silver.seats.get(row);
                    if (seatsInRow) {
                        for (let j = 0; j < seatsInRow.length; j++) {
                            const seat = seatsInRow[j];
                            if (seat.col === Number(seatNum)) {
                                seat.isBooked = true;
                                break;
                            }
                        }
                    }
                }
            }
            yield this.showSeatRepository.udateShowSeatById(tempTicket.showId.seatId, showSeat);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                message: 'Success',
                data: ticket,
            };
        });
    }
    userTicketHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketRepository.getTicketsByUserId(userId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: ticket,
                };
            }
            catch (error) {
            }
        });
    }
    getTicketsTheaters(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketRepository.getTicketsByTheaterId(theaterId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: tickets,
                };
            }
            catch (error) {
            }
        });
    }
    getAllTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketRepository.getTicketsAll();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: tickets,
                };
            }
            catch (error) {
            }
        });
    }
    getChartData(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketRepository.getTicketsByTheaterId(theaterId);
                let obj = {
                    'Jan': 0,
                    'Feb': 0,
                    'Mar': 0,
                    'Apr': 0,
                    'May': 0,
                    'Jun': 0,
                    'Jul': 0,
                    'Aug': 0,
                    'Sep': 0,
                    'Oct': 0,
                    'Nov': 0,
                    'Dec': 0,
                };
                // Count tickets for each month
                tickets.forEach(ticket => {
                    const createdAt = new Date(ticket.createdAt);
                    const month = createdAt.toLocaleString('en-US', { month: 'short' });
                    obj[month] += ticket.seatCount;
                });
                let Arr = Object.values(obj);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: Arr,
                };
            }
            catch (error) {
                console.error('Error:', error);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: 'Error occurred while fetching chart data',
                    data: null,
                };
            }
        });
    }
    getAllChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketRepository.getTicketsAll();
                let obj = {
                    'Jan': 0,
                    'Feb': 0,
                    'Mar': 0,
                    'Apr': 0,
                    'May': 0,
                    'Jun': 0,
                    'Jul': 0,
                    'Aug': 0,
                    'Sep': 0,
                    'Oct': 0,
                    'Nov': 0,
                    'Dec': 0,
                };
                // Count tickets for each month
                tickets.forEach(ticket => {
                    const createdAt = new Date(ticket.createdAt);
                    const month = createdAt.toLocaleString('en-US', { month: 'short' });
                    obj[month] += ticket.seatCount;
                });
                let Arr = Object.values(obj);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: Arr,
                };
            }
            catch (error) {
                console.error('Error:', error);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: 'Error occurred while fetching chart data',
                    data: null,
                };
            }
        });
    }
    cancelTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketRepository.findTicketById(ticketId);
                if (ticket) {
                    const show = yield this.showRepository.findShowById(ticket.showId);
                    console.log("showId: ", show === null || show === void 0 ? void 0 : show.seatId);
                    if (show) {
                        const showSeat = yield this.showSeatRepository.findShowSeatByIdS(show === null || show === void 0 ? void 0 : show.seatId);
                        if (!showSeat) {
                            return {
                                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                                message: 'One or more required resources not found',
                                data: null,
                            };
                        }
                        for (let i = 0; i < ticket.seats.length; i++) {
                            let row = ticket.seats[i].seatNumber.slice(0, 1);
                            let seatNum = ticket.seats[i].seatNumber.slice(1);
                            if (ticket.seats[i].category === "diamond") {
                                const seatsInRow = showSeat.diamond.seats.get(row);
                                if (seatsInRow) {
                                    for (let j = 0; j < seatsInRow.length; j++) {
                                        const seat = seatsInRow[j];
                                        if (seat.col === Number(seatNum)) {
                                            seat.isBooked = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            else if (ticket.seats[i].category === "gold") {
                                const seatsInRow = showSeat.gold.seats.get(row);
                                if (seatsInRow) {
                                    for (let j = 0; j < seatsInRow.length; j++) {
                                        const seat = seatsInRow[j];
                                        if (seat.col === Number(seatNum)) {
                                            seat.isBooked = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            else {
                                const seatsInRow = showSeat.silver.seats.get(row);
                                if (seatsInRow) {
                                    for (let j = 0; j < seatsInRow.length; j++) {
                                        const seat = seatsInRow[j];
                                        if (seat.col === Number(seatNum)) {
                                            seat.isBooked = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        yield this.showSeatRepository.udateShowSeatByIdS(show === null || show === void 0 ? void 0 : show.seatId, showSeat);
                    }
                    const updatedShow = yield this.showRepository.updatedAvailSeat(ticket.showId, ticket.seatCount);
                    const updatedTicket = yield this.ticketRepository.cancelTicket(ticketId);
                    yield this.userRepository.updateWallet(ticket.userId, ticket.totalPrice, "Ticket Cancellation Refund");
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: updatedTicket,
                    };
                }
            }
            catch (error) {
                // Handle error
            }
        });
    }
}
exports.TicketUseCase = TicketUseCase;
