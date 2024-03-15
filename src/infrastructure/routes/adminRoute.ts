import express from "express";
import { adminAuth } from "../middleware/adminAuth";
import { aController } from "../../providers/controllers";
const adminRouter = express.Router()

adminRouter.post('/login',  (req, res) => aController.adminLogin(req, res))

// adminRouter.get('/dashboard/revenue', adminAuth, (req, res) => aController.getRevenueData(req, res))
adminRouter.get('/users', adminAuth, (req, res) => aController.getAllUsers(req,res))
adminRouter.patch('/users/block/:userId', adminAuth, (req, res) => aController.blockUser(req,res))
// adminRouter.get('/theaters', adminAuth, (req, res) => aController.getAllTheaters(req,res))
// adminRouter.patch('/theaters/block/:theaterId', adminAuth,  (req, res) => aController.blockTheater(req,res))
// adminRouter.patch('/theaters/approval/:theaterId', adminAuth,  (req, res) => aController.theaterApproval(req,res))

export default adminRouter