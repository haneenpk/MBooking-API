import express from "express";
import { adminAuth } from "../middleware/adminAuth";
import { aController } from "../../providers/controllers";
const adminRouter = express.Router()

adminRouter.post('/login',  (req, res) => aController.adminLogin(req, res))

adminRouter.get('/users', adminAuth, (req, res) => aController.getUsers(req,res))
adminRouter.patch('/users/block/:userId', adminAuth, (req, res) => aController.blockUser(req,res))
adminRouter.get('/theaters', adminAuth, (req, res) => aController.getTheaters(req,res))
adminRouter.patch('/theaters/block/:theaterId', adminAuth,  (req, res) => aController.blockTheater(req,res))

export default adminRouter