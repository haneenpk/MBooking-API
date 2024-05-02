import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempTicketRepository } from "../infrastructure/repositories/tempTicketRepository";
import { ITicketRepo } from "../interfaces/repos/ticketRepo";
import { IUserRepo } from "../interfaces/repos/userRepo";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { ShowSeatRepository } from "../infrastructure/repositories/showSeatRepository";
import { ID } from "../interfaces/common";
import Stripe from 'stripe';

export class TicketUseCase {
    constructor(
        private readonly ticketRepository: ITicketRepo,
        private readonly tempTicketRepository: TempTicketRepository,
        private readonly showRepository: ShowRepository,
        private readonly showSeatRepository: ShowSeatRepository,
        private readonly userRepository: IUserRepo
    ) { }

    async holdSeats(seatId: ID, selectedSeat: any, showId: ID, userId: string): Promise<any> {
        try {
            const showSeat = await this.showSeatRepository.findShowSeatById(seatId);
            const show = await this.showRepository.findShowById(showId);
            const user = await this.userRepository.findById(userId);

            // Check if showSeat, show, and user exist
            if (!showSeat || !show || !user) {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'One or more required resources not found',
                    data: null,
                }
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
                } else if (selectedSeat[i].category === "gold") {
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
                } else {
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

            const tempTicket = await this.tempTicketRepository.saveTicketDataTemporarily(obj)

            const updated = await this.showSeatRepository.udateShowSeatById(seatId, showSeat);

            // Set a timer to expire after 10 minutes
            setTimeout(async () => {
                console.log("8 sec");
                const showSeatNew = await this.showSeatRepository.findShowSeatById(seatId);

                if (!showSeatNew) {
                    return {
                        status: STATUS_CODES.UNAUTHORIZED,
                        message: 'One or more required resources not found',
                        data: null,
                    }
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
                    } else if (selectedSeat[i].category === "gold") {
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
                    } else {
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
                await this.showSeatRepository.udateShowSeatById(seatId, showSeatNew);
            },10 * 60 * 1000); // 10 minutes in milliseconds
            return get200Response(tempTicket);

        } catch (error) {
            // Handle error
            // return get500Response(error.message);
        }
    }

    async getTempTicket(tempTicketId: ID): Promise<any> {
        try {
            const tempTicket = await this.tempTicketRepository.findTempTicketById(tempTicketId);
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: tempTicket,
            }
        } catch (error) {
            // return get500Response(error.message);
        }
    }

    async confirmTicket(tempTicketId: ID, payment: string): Promise<any> {
        try {
            const tempTicket = await this.tempTicketRepository.findTempTicketById(tempTicketId);

            if (!tempTicket) {
                throw new Error('Temp ticket not found.');
            }

            if(payment === "Stripe"){
                const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

                if (!stripeSecretKey) {
                    throw new Error('Stripe secret key is not defined in the environment variables.');
                }
    
                const stripe = new Stripe(stripeSecretKey);
    
                const customer = await stripe.customers.create({
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
    
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    customer: customer.id,
                    success_url: `${process.env.CORS_URI}/booking/success?tempTicketId=${tempTicketId}`,
                    cancel_url: `${process.env.CORS_URI}/payment/`,
                    line_items: [
                        {
                            price_data: {
                                currency: 'inr',
                                unit_amount: (tempTicket.total ?? 0) * 100,
                                product_data: {
                                    name: tempTicket.seatCount ? `${tempTicket.seatCount} seats` : 'Unknown Seats'
                                }
                            },
                            quantity: 1
                        }
                    ]
                });
    
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    session, // Return the session object
                };
            } else {
                let user = await this.userRepository.updateWallet(tempTicket.userId, -tempTicket.total, "Buy a Ticket")
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    user, // Return the session object
                };
            }

        } catch (error) {
            console.error(error);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: 'Error confirming ticket',
                error: error,
            };
        }
    }

    async saveTicket(tempTicketId: ID): Promise<any> {
        const tempTicket = await this.tempTicketRepository.getTicketData(tempTicketId);

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

        const ticket = await this.ticketRepository.saveTicket(obj);

        const updatedShow = await this.showRepository.updatedAvailSeat(tempTicket.showId._id, -tempTicket.seatCount)        

        const showSeat = await this.showSeatRepository.findShowSeatById(tempTicket.showId.seatId);

        if (!showSeat) {
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'One or more required resources not found',
                data: null,
            }
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
            } else if (tempTicket.seats[i].category === "gold") {
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
            } else {
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

        await this.showSeatRepository.udateShowSeatById(tempTicket.showId.seatId, showSeat);

        return {
            status: STATUS_CODES.OK,
            message: 'Success',
            data: ticket,
        }

    }

    async userTicketHistory (userId: string): Promise<any> {
        try {

            const ticket = await this.ticketRepository.getTicketsByUserId(userId);
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: ticket,
            }
            
        } catch (error) {
            
        }
    }

    async getTicketsTheaters (theaterId: string): Promise<any> {
        try {

            const tickets = await this.ticketRepository.getTicketsByTheaterId(theaterId);
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: tickets,
            }
            
        } catch (error) {
            
        }
    }

    async getAllTickets (): Promise<any> {
        try {

            const tickets = await this.ticketRepository.getTicketsAll();
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: tickets,
            }
            
        } catch (error) {
            
        }
    }

    async cancelTicket(ticketId: string): Promise<any> {
        try {
            const ticket = await this.ticketRepository.findTicketById(ticketId);
    
            if (ticket) {
                const show = await this.showRepository.findShowById(ticket.showId);
                console.log("showId: ", show?.seatId);
                
                if (show) {
                    const showSeat = await this.showSeatRepository.findShowSeatByIdS(show?.seatId);

                    if (!showSeat) {
                        return {
                            status: STATUS_CODES.UNAUTHORIZED,
                            message: 'One or more required resources not found',
                            data: null,
                        }
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
                        } else if (ticket.seats[i].category === "gold") {
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
                        } else {
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
            
                    await this.showSeatRepository.udateShowSeatByIdS(show?.seatId, showSeat);
                }

                const updatedShow = await this.showRepository.updatedAvailSeat(ticket.showId, ticket.seatCount)

                const updatedTicket = await this.ticketRepository.cancelTicket(ticketId)

                await this.userRepository.updateWallet(ticket.userId, ticket.totalPrice, "Ticket Cancellation Refund")
            
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: updatedTicket,
                }
            }
        } catch (error) {
            // Handle error
        }
    }

}