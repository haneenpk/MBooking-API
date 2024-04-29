import express from "express";
import { userAuth } from "../middleware/userAuth";
import { uController, upcController, showController, mController, tController, showSeatController, chatController, ticketController } from "../../providers/controllers";
import upload from "../config/multer"; // Adjust import statement here

const userRouter = express.Router()

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.post('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))

userRouter.patch('/update/profileimage/:userId', userAuth, upload.single('profilePicture'), (req,res) => uController.updateUserProfileDp(req,res))
userRouter.patch('/remove/profileimage/:userId', userAuth, (req,res) => uController.removeUserProfileDp(req,res))

userRouter.put('/update/:userId', userAuth, (req,res) => uController.updateProfile(req,res))

userRouter.get('/get/:userId', userAuth,  (req,res) => uController.getUserData(req,res))
userRouter.get('/get/theater/:theaterId', userAuth,  (req,res) => tController.getTheaterData(req,res))

userRouter.get('/upcomings', userAuth, (req, res) => upcController.getUpcomings(req,res))
userRouter.get('/upcoming/get/:upcomingId', userAuth, (req, res) => upcController.findUpcomingById(req,res))

userRouter.get('/movies', userAuth, (req, res) => showController.getMovies(req,res))
userRouter.get('/movie/get/:movieId', userAuth, (req, res) => mController.findMovieById(req,res))

userRouter.get('/showTime', userAuth, (req, res) => showController.getShows(req,res))
userRouter.get('/selectShowTime', userAuth, (req, res) => showController.getSelectShows(req,res))
userRouter.get('/show/seat/:seatId', userAuth, (req, res) => showSeatController.findShowSeatById(req,res))

userRouter.get('/all/theaters', userAuth,  (req,res) => tController.getAllTheater(req,res))
userRouter.get('/chat/theaters/:userId', userAuth, (req, res) => chatController.getTheatersChattedWith(req, res))
userRouter.get('/chat/history', userAuth, (req, res) => chatController.getChatHistory(req, res))

userRouter.post('/show/booking/hold', userAuth, (req, res) => ticketController.holdSeats(req, res))
userRouter.get('/show/tempTicket/:tempTicketId', userAuth, (req, res) => ticketController.getTempTicket(req, res))

userRouter.post('/booking/ticket/:tempTicketId', userAuth, (req, res) => ticketController.confirmTicket(req, res))
userRouter.get('/booking/save/:tempTicketId', userAuth, (req, res) => ticketController.saveTicket(req, res))
userRouter.get('/booking-history/:userId', userAuth, (req, res) => ticketController.userTicketHistory(req, res))
userRouter.get('/ticket/cancel/:ticketId', userAuth, (req, res) => ticketController.cancelTicket(req, res))

export default userRouter