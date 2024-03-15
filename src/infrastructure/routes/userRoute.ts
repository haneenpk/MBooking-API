import express from "express";

// import { user } from "../../providers/injection";
import { userAuth } from "../middleware/userAuth";
import { uController } from "../../providers/controllers";
// import { uController, tController, mController, chatController, showController, ticketController, showSeatsController, couponController } from "../../providers/controllers";

// import { upload } from "../config/multer";

const userRouter = express.Router()

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
// userRouter.post('/auth/sign-up', (req, res) => user.singup(req,res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.post('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))

userRouter.put('/update/:userId', userAuth, (req,res) => uController.updateProfile(req,res))
// userRouter.patch('/update/profileimage/:userId', userAuth, upload.single('image'), (req,res) => uController.updateUserProfileDp(req,res))
// userRouter.patch('/remove/profileimage/:userId', userAuth, (req,res) => uController.removeUserProfileDp(req,res))

userRouter.get('/get/:userId', userAuth,  (req,res) => uController.getUserData(req,res))
// userRouter.get('/theaters', (req,res) => tController.loadTheaters(req,res))
// userRouter.get('/theater/:theaterId', (req,res) => tController.getTheaterData(req,res))

// userRouter.get('/shows/seats/:showSeatId', (req, res) => showSeatsController.findShowSeatById(req, res))

export default userRouter
