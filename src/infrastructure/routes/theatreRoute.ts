import express from "express";
import { theaterAuth } from "../middleware/theaterAuth";
import { tController, scnController } from "../../providers/controllers";

const thrRouter = express.Router()

thrRouter.post('/register', (req, res) => tController.theaterRegister(req, res))
thrRouter.post('/validateOTP', (req, res) =>  tController.validateTheaterOTP(req, res))
thrRouter.post('/login', (req, res) => tController.theaterLogin(req, res))
thrRouter.post('/resendOTP', (req, res) => tController.resendOTP(req, res))

thrRouter.get('/get/:theaterId', theaterAuth,  (req,res) => tController.getTheaterData(req,res))

thrRouter.put('/update/:theaterId', theaterAuth, (req, res) => tController.updateTheaterData(req, res))

thrRouter.get('/screens/:theaterId', theaterAuth, (req, res) => scnController.findScreensInTheater(req, res))
thrRouter.post('/screens/add/:theaterId', theaterAuth, (req, res) => scnController.saveScreen(req, res))

export default thrRouter