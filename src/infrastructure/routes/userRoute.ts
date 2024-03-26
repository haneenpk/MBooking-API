import express from "express";
import { userAuth } from "../middleware/userAuth";
import { uController } from "../../providers/controllers";
import upload from "../config/multer";

const userRouter = express.Router()

userRouter.post('/register', (req, res) => uController.userRegister(req,res))
userRouter.post('/validateOtp', (req,res) => uController.validateUserOTP(req,res))
userRouter.post('/resendOtp', (req,res) => uController.resendOTP(req,res))
userRouter.post('/login', (req,res) => uController.userLogin(req,res))

userRouter.patch('/update/profileimage/:userId', userAuth, upload.single('profilePicture'), (req,res) => uController.updateUserProfileDp(req,res))
userRouter.patch('/remove/profileimage/:userId', userAuth, (req,res) => uController.removeUserProfileDp(req,res))

userRouter.put('/update/:userId', userAuth, (req,res) => uController.updateProfile(req,res))

userRouter.get('/get/:userId', userAuth,  (req,res) => uController.getUserData(req,res))

export default userRouter
