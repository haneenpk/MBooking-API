import express from "express";
import { theaterAuth } from "../middleware/theaterAuth";
import { tController, scnController, screenSeatController } from "../../providers/controllers";

const thrRouter = express.Router()

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))
thrRouter.post('/resendOTP', (req, res) => tController.resendOTP(req, res))

thrRouter.get('/get/:theaterId', theaterAuth, (req,res) => tController.getTheaterData(req,res))

thrRouter.put('/update/:theaterId', theaterAuth, (req, res) => tController.updateTheaterData(req, res))

thrRouter.get('/screens/:theaterId', theaterAuth, (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', theaterAuth, (req, res) => scnController.saveScreen(req, res))
thrRouter.get('/screens/get/:screenId', theaterAuth, (req, res) => scnController.findScreenById(req, res))
thrRouter.patch('/screens/edit/:screenId', theaterAuth, (req, res) => scnController.updateScreenName(req, res))
thrRouter.delete('/screens/delete/:screenId', theaterAuth, (req, res) => scnController.deleteScreen(req, res))

thrRouter.get('/screens/seat/:seatId', theaterAuth, (req, res) => screenSeatController.findScreenSeatById(req, res))
thrRouter.put('/screens/seat/update/:seatId', theaterAuth, (req, res) => screenSeatController.updateScreenSeat(req, res))
thrRouter.get('/screens/get/seats/:screenId', theaterAuth, (req, res) => scnController.getAvailSeatsOnScreen(req, res))

export default thrRouter