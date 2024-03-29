// import { AuthRes } from "../Types/AuthRes";
import { log } from "console";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import { IApiRes, ID } from "../interfaces/common";
import { ITempUserReq, ITempUserRes } from "../interfaces/schema/tempUserSchema";
import { IApiUserAuthRes, IApiUserRes, IUser, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../interfaces/schema/userSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";
import path from "path";
import fs from 'fs'

export class UserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tempUserRepository: TempUserRepository,
        private readonly encrypt: Encrypt,
        private readonly jwt: JWTToken,
        private readonly mailer: MailSender,
    ) { }

    async isUsernameExist(username: string): Promise<IUser | null> {
        const isUserExist = await this.userRepository.findByUsername(username)
        return isUserExist
    }

    async isEmailExist(email: string): Promise<IUser | null> {
        const isEmailExist = await this.userRepository.findByEmail(email)
        return isEmailExist
    }

    async saveUserDetails(userData: IUserAuth | IUserSocialAuth): Promise<any> {
        const user = await this.userRepository.saveUser(userData)

        return {
            status: STATUS_CODES.OK,
            data: user,
            message: 'Success',
        }
    }

    async saveUserTemporarily(userData: ITempUserReq): Promise<ITempUserRes & { userAuthToken: string }> {

        const user = await this.tempUserRepository.saveUser(userData)
        // console.log(user, 'temp user saved');
        const userAuthToken = this.jwt.generateTempToken(user._id)
        return { ...JSON.parse(JSON.stringify(user)), userAuthToken }
    }

    async updateOtp(id: ID, email: string, OTP: number) {
        return await this.tempUserRepository.updateOTP(id, email, OTP)
    }

    async findTempUserByEmail(email: string) {
        return await this.tempUserRepository.findByEmail(email)
    }

    async deleteTempUserByEmail(email: string) {
        return await this.tempUserRepository.deleteByEmail(email)
    }

    // To send an otp to user that will expire after a certain period
    sendTimeoutOTP(id: ID, email: string, OTP: number) {
        try {
            this.mailer.sendOTP(email, OTP)

            setTimeout(async () => {
                await this.tempUserRepository.unsetOtp(id, email)
            }, OTP_TIMER)

        } catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp')
        }
    }

    async verifyLogin(email: string, password: string): Promise<IApiUserAuthRes> {
        const userData = await this.userRepository.findByEmail(email)
        if (userData !== null) {
            if (userData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You are blocked by admin',
                    data: null,
                    accessToken: '',
                }
            } else {
                const passwordMatch = await this.encrypt.comparePasswords(password, userData.password as string)
                if (passwordMatch) {
                    const accessToken = this.jwt.generateAccessToken(userData._id)
                    return {
                        status: STATUS_CODES.OK,
                        message: 'Success',
                        data: userData,
                        accessToken,
                    }
                } else {
                    return {
                        status: STATUS_CODES.UNAUTHORIZED,
                        message: 'Incorrect Password',
                        data: null,
                        accessToken: '',
                    }
                }
            }
        }

        return {
            status: STATUS_CODES.UNAUTHORIZED,
            message: 'Invalid email or password!',
            data: null,
            accessToken: '',
        };

    }

    async getUsers(): Promise<IApiRes<{users: IUserRes[]}> | IApiRes<null>> {
        try {
            const users = await this.userRepository.findUsers()
            return get200Response({ users })

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async blockUser(userId: string) {
        try {
            await this.userRepository.blockUnblockUser(userId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUserData(userId: ID): Promise<IApiUserRes> {
        try {
            const user = await this.userRepository.getUserData(userId)
            if (user) return get200Response(user)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserData(userId: ID, user: IUserUpdate): Promise<IApiUserRes> {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, user)
            return get200Response(updatedUser as IUserRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUserProfilePic (userId: string, fileName: string | undefined): Promise<IApiUserRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(userId, fileName, 'userId, filename from use case')
            const user = await this.userRepository.findById(userId)
            // Deleting user dp if it already exist
            if (user && user.profilePic) {
                const filePath = path.join(__dirname, `../../${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this.userRepository.updateUserProfilePic(userId, fileName)
            if (updatedUser) return get200Response(updatedUser)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async removeUserProfileDp (userId: string): Promise<IApiUserRes> {
        try {
            const user = await this.userRepository.findById(userId)
            if (!user) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
            // Deleting user dp if it already exist
            if (user.profilePic) {
                const filePath = path.join(__dirname, `../../${user.profilePic}`)
                fs.unlinkSync(filePath);
            }
            const updatedUser = await this.userRepository.removeUserProfileDp(userId)
            if (updatedUser) {
                return get200Response(updatedUser) 
            }
            
            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}