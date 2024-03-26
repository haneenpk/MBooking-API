import { Request, Response } from "express";
import { UserUseCase } from "../../useCases/userUseCase";
import { GenerateOtp } from "../../providers/otpGenerator";
import { Encrypt } from "../../providers/bcryptPassword";
import { IUser, IUserAuth, IUserUpdate } from "../../interfaces/schema/userSchema";
import { ITempUserReq } from "../../interfaces/schema/tempUserSchema";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";
import multer, { Multer } from 'multer';

// Define the type for Express Request with multer file property
interface MulterRequest extends Request {
  file: Express.Multer.File;
}


export class UserController {
    constructor(
        private readonly userUseCase: UserUseCase,
        private readonly otpGenerator: GenerateOtp,
        private readonly encrypt: Encrypt
    ) { }

    async userRegister(req: Request, res: Response) {
        try {
            const { username, email, mobile, password } = req.body as IUserAuth
            console.log(username, email);

            const isUsernameExist = await this.userUseCase.isUsernameExist(username)
            const isEmailExist = await this.userUseCase.isEmailExist(email)

            if (isUsernameExist === null) {
                if (isEmailExist === null) {
                    const OTP = this.otpGenerator.generateOTP()

                    // console.log(OTP,'OTP');
                    const securePassword = await this.encrypt.encryptPassword(password)
                    const user: ITempUserReq = { username, email, mobile, password: securePassword, otp: OTP }

                    const tempUser = await this.userUseCase.saveUserTemporarily(user)

                    this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP)

                    // console.log('responding with 200');
                    res.status(STATUS_CODES.OK).json({ message: 'Success' })
                } else {
                    res.status(STATUS_CODES.FORBIDDEN).json({ message: "Email already Exist" });
                }
            } else {
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Username already Exist" });
            }

        } catch (error) {
            console.log(error);
            console.log('error while register');
        }
    }

    async validateUserOTP(req: Request, res: Response) {
        try {
            console.log('validating otp');
            console.log(req.body.otp, req.body.email);
            const { otp, email } = req.body

            // console.log(authToken, 'authToken from validate otp');

            const user = await this.userUseCase.findTempUserByEmail(email)
            if (user) {
                console.log(user);

                if (otp == user.otp) {
                    const savedData = await this.userUseCase.saveUserDetails({
                        username: user.username,
                        email: user.email,
                        mobile: user.mobile,
                        password: user.password
                    })
                    console.log('user details saved, setting status 200');

                    await this.userUseCase.deleteTempUserByEmail(req.body.email)

                    res.status(savedData.status).json(savedData)
                } else {
                    console.log('otp didnt match');
                    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid OTP' })
                }
            } else {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Timeout, Register again' })
            }

        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    async resendOTP(req: Request, res: Response) {
        try {

            console.log("fasdfasd");
            

            const tempUser = await this.userUseCase.findTempUserByEmail(req.body.email)
            if (tempUser) {
                const OTP = this.otpGenerator.generateOTP()
                // console.log(tempUser, 'userData');
                console.log(OTP, 'new resend otp');
                await this.userUseCase.updateOtp(tempUser._id, tempUser.email, OTP)
                this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP)
                res.status(STATUS_CODES.OK).json({ message: 'OTP has been sent' })
            } else {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'user timeout, register again' })
            }

        } catch (error) {
            const err = error as Error
            console.log(error);
            res.status(500).json({ message: err.message })
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body as IUser
            const authData = await this.userUseCase.verifyLogin(email, password as string)
            res.status(authData.status).json(authData)
        } catch (error) {
            console.log(error);
            // next(error)
        }
    }

    // to get user data using userId
    async getUserData(req: Request, res: Response) {
        const userId: ID = req.params.userId as unknown as ID
        const apiRes = await this.userUseCase.getUserData(userId)
        
        res.status(apiRes.status).json(apiRes)
    }

    // To update user details from profile
    async updateProfile(req: Request, res: Response) {
        const user = req.body as IUserUpdate
        const userId: ID = req.params.userId as unknown as ID
        const apiRes = await this.userUseCase.updateUserData(userId, user)
        
        res.status(apiRes.status).json(apiRes)
    }

    async updateUserProfileDp (req: Request, res: Response) {
        const userId = req.params.userId
        const fileName = req.file?.path
        console.log("Form Data:", req.body); 
        console.log("File:", fileName);
        const apiRes = await this.userUseCase.updateUserProfilePic(userId, fileName)
        res.status(apiRes.status).json(apiRes)
    }

    async removeUserProfileDp (req: Request, res: Response) { 
        const userId = req.params.userId
        const apiRes = await this.userUseCase.removeUserProfileDp(userId)
        res.status(apiRes.status).json(apiRes)
    }

}