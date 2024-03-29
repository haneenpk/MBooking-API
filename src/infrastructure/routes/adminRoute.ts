import express from "express";
import { adminAuth } from "../middleware/adminAuth";
import { aController, upcController, scnController, screenSeatController, mController } from "../../providers/controllers";
import upload from "../config/multer";

const adminRouter = express.Router()

adminRouter.post('/login',  (req, res) => aController.adminLogin(req, res))

adminRouter.get('/get/:adminId', adminAuth,  (req,res) => aController.getAdminData(req,res))

adminRouter.put('/update/:adminId', adminAuth, (req,res) => aController.updateProfile(req,res))

adminRouter.get('/users', adminAuth, (req, res) => aController.getUsers(req,res))
adminRouter.patch('/users/block/:userId', adminAuth, (req, res) => aController.blockUser(req,res))
adminRouter.get('/theaters', adminAuth, (req, res) => aController.getTheaters(req,res))
adminRouter.patch('/theaters/block/:theaterId', adminAuth,  (req, res) => aController.blockTheater(req,res))

adminRouter.get('/screens/:theaterId', adminAuth, (req, res) => scnController.findScreensInTheater(req, res))
adminRouter.get('/screens/seat/:seatId', adminAuth, (req, res) => screenSeatController.findScreenSeatById(req, res))
adminRouter.put('/screens/seat/update/:seatId', adminAuth, (req, res) => screenSeatController.updateScreenSeat(req, res))

adminRouter.post('/upcoming/add', adminAuth, upload.single('image'), (req,res) => upcController.addUpcomingMovies(req,res))
adminRouter.delete('/upcoming/delete/:upcomingId', adminAuth, (req,res) => upcController.deleteUpcomingMovies(req,res))
adminRouter.get('/upcomings', adminAuth, (req, res) => upcController.getUpcomings(req,res))
adminRouter.get('/upcoming/get/:upcomingId', adminAuth, (req, res) => upcController.findUpcomingById(req,res))
adminRouter.put('/upcoming/edit/:upcomingId', adminAuth, (req, res) => upcController.updateUpcomingMovies(req,res))
adminRouter.patch('/upcoming/edit/image/:upcomingId', upload.single('image'), adminAuth, (req, res) => upcController.updateUpcomingImage(req,res))

adminRouter.post('/movie/add', adminAuth, upload.single('image'), (req,res) => mController.addMovies(req,res))
adminRouter.delete('/movie/delete/:movieId', adminAuth, (req,res) => mController.deleteMovies(req,res))
adminRouter.get('/movies', adminAuth, (req, res) => mController.getMovies(req,res))
adminRouter.get('/movie/get/:movieId', adminAuth, (req, res) => mController.findMovieById(req,res))
adminRouter.put('/movie/edit/:movieId', adminAuth, (req, res) => mController.updateMovies(req,res))
adminRouter.patch('/movie/edit/image/:movieId', upload.single('image'), adminAuth, (req, res) => mController.updateImage(req,res))


export default adminRouter