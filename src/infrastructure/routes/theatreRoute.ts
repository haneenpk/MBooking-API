import express from "express";
import { theaterAuth } from "../middleware/theaterAuth";
import { tController, scnController, screenSeatController, mController, showController, chatController, ticketController } from "../../providers/controllers";

const thrRouter = express.Router()

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))
thrRouter.post('/resendOTP', (req, res) => tController.resendOTP(req, res))

thrRouter.get('/get/:theaterId', theaterAuth, (req,res) => tController.getTheaterData(req,res))

thrRouter.get('/get/ChartData/:theaterId', theaterAuth, (req, res) => ticketController.getChartData(req, res))

thrRouter.put('/update/:theaterId', theaterAuth, (req, res) => tController.updateTheaterData(req, res))

thrRouter.get('/screens/:theaterId', theaterAuth, (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', theaterAuth, (req, res) => scnController.saveScreen(req, res))
thrRouter.get('/screens/get/:screenId', theaterAuth, (req, res) => scnController.findScreenById(req, res))
thrRouter.patch('/screens/edit/:screenId', theaterAuth, (req, res) => scnController.updateScreenName(req, res))
thrRouter.delete('/screens/delete/:screenId', theaterAuth, (req, res) => scnController.deleteScreen(req, res))

thrRouter.get('/screens/seat/:seatId', theaterAuth, (req, res) => screenSeatController.findScreenSeatById(req, res))
thrRouter.put('/screens/seat/update/:seatId', theaterAuth, (req, res) => screenSeatController.updateScreenSeat(req, res))
thrRouter.get('/screens/get/seats/:screenId', theaterAuth, (req, res) => scnController.getAvailSeatsOnScreen(req, res))

thrRouter.get('/movies', theaterAuth, (req, res) => mController.getMovies(req,res))
thrRouter.get('/movie/get/:movieId', theaterAuth, (req, res) => mController.findMovieById(req,res))

thrRouter.get('/shows/:theaterId', theaterAuth, (req, res) => showController.findShowsOnTheater(req, res))
thrRouter.get('/shows/first/:theaterId', theaterAuth, (req, res) => showController.findFirstShowsOnTheater(req, res))
thrRouter.post('/show/add/:theaterId', theaterAuth, (req, res) => showController.addShow(req, res))
thrRouter.get('/show/edit/:showId', theaterAuth, (req, res) => showController.editShowGet(req, res))
thrRouter.post('/show/edit/:showId', theaterAuth, (req, res) => showController.editShow(req, res))
thrRouter.delete('/show/delete/:showId', theaterAuth, (req,res) => showController.deleteShow(req,res))

thrRouter.get('/chat/users/:theaterId', theaterAuth, (req, res) => chatController.getUsersChattedWith(req, res))
thrRouter.get('/chat/history', theaterAuth, (req, res) => chatController.getChatHistory(req, res))

thrRouter.get('/tickets/:theaterId', theaterAuth, (req, res) => ticketController.getTicketsTheaters(req, res))

export default thrRouter