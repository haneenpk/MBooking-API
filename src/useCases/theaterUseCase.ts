import { log } from "console";
import { OTP_TIMER } from "../constants/constants";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { TempTheaterRepository } from "../infrastructure/repositories/tempTheaterRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { IApiAuthRes, IApiRes, IApiTempAuthRes, ID } from "../interfaces/common";
import { IApiTempTheaterRes, ITempTheaterReq, ITempTheaterRes } from "../interfaces/schema/tempTheaterSchema";
import { IApiTheaterAuthRes, IApiTheaterRes, ITheaterUpdate, ITheatersAndCount } from "../interfaces/schema/theaterSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";
import { MailSender } from "../providers/nodemailer";
import { GenerateOtp } from "../providers/otpGenerator";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";
import fs from 'fs'


export class TheaterUseCase {
    constructor(
        private readonly theaterRepository: TheaterRepository,
        private readonly tempTheaterRepository: TempTheaterRepository,
        private readonly encrypt: Encrypt,
        private readonly jwtToken: JWTToken,
        private readonly mailer: MailSender,
        private readonly otpGenerator: GenerateOtp,
    ) { }

    async verifyAndSaveTemporarily(theaterData: ITempTheaterReq): Promise<IApiTempAuthRes<ITempTheaterRes>> {
        try {
            const isEmailExist = await this.isEmailExist(theaterData.email);
            if (isEmailExist) {
                return getErrorResponse(STATUS_CODES.FORBIDDEN, 'Email Already Exist')
            } else {
                theaterData.otp = this.otpGenerator.generateOTP()
                theaterData.password = await this.encrypt.encryptPassword(theaterData.password)

                const tempTheater = await this.tempTheaterRepository.saveTheater(theaterData)
                this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp)

                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: tempTheater,
                }
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To send an otp to mail,and delete after spcified time (OTP_TIMER)
    sendTimeoutOTP(id: ID, email: string, OTP: number) {
        console.log(OTP, 'otp from sendTimoutOTP');
        this.mailer.sendOTP(email, OTP)

        setTimeout(async () => {
            await this.tempTheaterRepository.unsetTheaterOTP(id, email)
        }, OTP_TIMER)
    }

    async verifyAndSendNewOTP(email: string): Promise<IApiTempTheaterRes> {
        try {
            
            const tempTheater = await this.tempTheaterRepository.findTempTheaterByEmail(email)
            if (tempTheater) {
                const newOTP = this.otpGenerator.generateOTP()
                await this.tempTheaterRepository.updateTheaterOTP(tempTheater._id, tempTheater.email, newOTP)
                this.sendTimeoutOTP(tempTheater._id, tempTheater.email, newOTP)
                return get200Response(null)
            } else {
                return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Unautherized')
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async validateAndSaveTheater(otp: number, email: string): Promise<IApiAuthRes> {
        try {

            const theater = await this.tempTheaterRepository.findTempTheaterByEmail(email)
            if (theater) {
                if (otp == theater.otp) {
                    const savedTheater = await this.theaterRepository.saveTheater(theater)
                    await this.tempTheaterRepository.deleteTempTheaterById(email)
                    return {
                        status: STATUS_CODES.OK,
                        message: 'Success',
                        data: savedTheater,
                    }
                } else {
                    return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Incorrect OTP')
                }
            } else {
                return getErrorResponse(STATUS_CODES.UNAUTHORIZED, 'Unautherized')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async isEmailExist(email: string): Promise<boolean> {
        const isUserExist = await this.theaterRepository.findByEmail(email)
        return Boolean(isUserExist)
    }

    async verifyLogin(email: string, password: string): Promise<IApiTheaterAuthRes> {
        const theaterData = await this.theaterRepository.findByEmail(email)
        if (theaterData !== null) {

            if (theaterData.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    message: 'You have been blocked by admin',
                    data: null,
                    accessToken: '',
                }
            }

            const passwordMatch = await this.encrypt.comparePasswords(password, theaterData.password)
            if (passwordMatch) {
                const accessToken = this.jwtToken.generateAccessToken(theaterData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: theaterData,
                    accessToken,
                }
            } else {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Incorrect Password',
                    data: null,
                    accessToken: ''
                }
            }
        } else {
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email',
                data: null,
                accessToken: ''
            }
        }
    }

    async getTheaters(){
        try {
            const theaters = await this.theaterRepository.findTheaters()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: theaters
            };

        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error,
                data: null
            };
        }
    }

    // To Block Theater
    async blockTheater(theaterId: string) {
        try {
            await this.theaterRepository.blockTheater(theaterId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To update theater data, from theater profile
    async updateTheater(theaterId: ID, theater: ITheaterUpdate): Promise<IApiTheaterRes> {
        try {
            const theaterData = await this.theaterRepository.updateTheater(theaterId, theater)
            if (theaterData !== null) {
                return get200Response(theaterData)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, theaterId is not availble')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    // To get theater data using theaterId
    async getTheaterData(theaterId: ID): Promise<IApiTheaterRes> {
        try {
            if (theaterId === undefined) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            const theater = await this.theaterRepository.findById(theaterId)
            if (theater === null) return getErrorResponse(STATUS_CODES.BAD_REQUEST)
            return get200Response(theater)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}