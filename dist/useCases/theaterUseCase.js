"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheaterUseCase = void 0;
const constants_1 = require("../constants/constants");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
class TheaterUseCase {
    constructor(theaterRepository, tempTheaterRepository, encrypt, jwtToken, mailer, otpGenerator) {
        this.theaterRepository = theaterRepository;
        this.tempTheaterRepository = tempTheaterRepository;
        this.encrypt = encrypt;
        this.jwtToken = jwtToken;
        this.mailer = mailer;
        this.otpGenerator = otpGenerator;
    }
    verifyAndSaveTemporarily(theaterData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmailExist = yield this.isEmailExist(theaterData.email);
                if (isEmailExist) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.FORBIDDEN, 'Email Already Exist');
                }
                else {
                    theaterData.otp = this.otpGenerator.generateOTP();
                    theaterData.password = yield this.encrypt.encryptPassword(theaterData.password);
                    const tempTheater = yield this.tempTheaterRepository.saveTheater(theaterData);
                    this.sendTimeoutOTP(tempTheater._id, tempTheater.email, tempTheater.otp);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: tempTheater,
                    };
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To send an otp to mail,and delete after spcified time (OTP_TIMER)
    sendTimeoutOTP(id, email, OTP) {
        console.log(OTP, 'otp from sendTimoutOTP');
        this.mailer.sendOTP(email, OTP);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield this.tempTheaterRepository.unsetTheaterOTP(id, email);
        }), constants_1.OTP_TIMER);
    }
    verifyAndSendNewOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tempTheater = yield this.tempTheaterRepository.findTempTheaterByEmail(email);
                if (tempTheater) {
                    const newOTP = this.otpGenerator.generateOTP();
                    yield this.tempTheaterRepository.updateTheaterOTP(tempTheater._id, tempTheater.email, newOTP);
                    this.sendTimeoutOTP(tempTheater._id, tempTheater.email, newOTP);
                    return (0, response_1.get200Response)(null);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Unautherized');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    validateAndSaveTheater(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theater = yield this.tempTheaterRepository.findTempTheaterByEmail(email);
                if (theater) {
                    if (otp == theater.otp) {
                        const savedTheater = yield this.theaterRepository.saveTheater(theater);
                        yield this.tempTheaterRepository.deleteTempTheaterById(email);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: 'Success',
                            data: savedTheater,
                        };
                    }
                    else {
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Incorrect OTP');
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED, 'Unautherized');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this.theaterRepository.findByEmail(email);
            return Boolean(isUserExist);
        });
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterData = yield this.theaterRepository.findByEmail(email);
            if (theaterData !== null) {
                if (theaterData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: 'You have been blocked by admin',
                        data: null,
                        accessToken: '',
                    };
                }
                const passwordMatch = yield this.encrypt.comparePasswords(password, theaterData.password);
                if (passwordMatch) {
                    const accessToken = this.jwtToken.generateAccessToken(theaterData._id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        message: 'Success',
                        data: theaterData,
                        accessToken,
                    };
                }
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'Incorrect Password',
                        data: null,
                        accessToken: ''
                    };
                }
            }
            else {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email',
                    data: null,
                    accessToken: ''
                };
            }
        });
    }
    getTheaters() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theaters = yield this.theaterRepository.findTheaters();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: theaters
                };
            }
            catch (error) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: error,
                    data: null
                };
            }
        });
    }
    // To Block Theater
    blockTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.theaterRepository.blockTheater(theaterId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To update theater data, from theater profile
    updateTheater(theaterId, theater) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theaterData = yield this.theaterRepository.updateTheater(theaterId, theater);
                if (theaterData !== null) {
                    return (0, response_1.get200Response)(theaterData);
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, theaterId is not availble');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    // To get theater data using theaterId
    getTheaterData(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (theaterId === undefined)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                const theater = yield this.theaterRepository.findById(theaterId);
                if (theater === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                return (0, response_1.get200Response)(theater);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getAllTheater() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theaters = yield this.theaterRepository.findTheaters();
                if (theaters === null)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                return (0, response_1.get200Response)(theaters);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.TheaterUseCase = TheaterUseCase;
