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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
// import { AuthRes } from "../Types/AuthRes";
const console_1 = require("console");
const constants_1 = require("../constants/constants");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class UserUseCase {
    constructor(userRepository, tempUserRepository, encrypt, jwt, mailer) {
        this.userRepository = userRepository;
        this.tempUserRepository = tempUserRepository;
        this.encrypt = encrypt;
        this.jwt = jwt;
        this.mailer = mailer;
    }
    isUsernameExist(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield this.userRepository.findByUsername(username);
            return isUserExist;
        });
    }
    isEmailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEmailExist = yield this.userRepository.findByEmail(email);
            return isEmailExist;
        });
    }
    saveUserDetails(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.saveUser(userData);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: user,
                message: 'Success',
            };
        });
    }
    saveUserTemporarily(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tempUserRepository.saveUser(userData);
            // console.log(user, 'temp user saved');
            const userAuthToken = this.jwt.generateTempToken(user._id);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(user))), { userAuthToken });
        });
    }
    updateOtp(id, email, OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.updateOTP(id, email, OTP);
        });
    }
    findTempUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.findByEmail(email);
        });
    }
    deleteTempUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tempUserRepository.deleteByEmail(email);
        });
    }
    // To send an otp to user that will expire after a certain period
    sendTimeoutOTP(id, email, OTP) {
        try {
            this.mailer.sendOTP(email, OTP);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this.tempUserRepository.unsetOtp(id, email);
            }), constants_1.OTP_TIMER);
        }
        catch (error) {
            console.log(error);
            throw Error('Error while sending timeout otp');
        }
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.userRepository.findByEmail(email);
            if (userData !== null) {
                if (userData.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        message: 'You are blocked by admin',
                        data: null,
                        accessToken: '',
                    };
                }
                else {
                    const passwordMatch = yield this.encrypt.comparePasswords(password, userData.password);
                    if (passwordMatch) {
                        const accessToken = this.jwt.generateAccessToken(userData._id);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: 'Success',
                            data: userData,
                            accessToken,
                        };
                    }
                    else {
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                            message: 'Incorrect Password',
                            data: null,
                            accessToken: '',
                        };
                    }
                }
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid email or password!',
                data: null,
                accessToken: '',
            };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.findUsers();
                return (0, response_1.get200Response)({ users });
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.blockUnblockUser(userId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserData(userId);
                if (user)
                    return (0, response_1.get200Response)(user);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserData(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.updateUser(userId, user);
                return (0, response_1.get200Response)(updatedUser);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                (0, console_1.log)(userId, fileName, 'userId, filename from use case');
                const user = yield this.userRepository.findById(userId);
                // Deleting user dp if it already exist
                if (user && user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../${user.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedUser = yield this.userRepository.updateUserProfilePic(userId, fileName);
                if (updatedUser)
                    return (0, response_1.get200Response)(updatedUser);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
                // Deleting user dp if it already exist
                if (user.profilePic) {
                    const filePath = path_1.default.join(__dirname, `../../${user.profilePic}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedUser = yield this.userRepository.removeUserProfileDp(userId);
                if (updatedUser) {
                    return (0, response_1.get200Response)(updatedUser);
                }
                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
