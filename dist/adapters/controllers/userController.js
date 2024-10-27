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
exports.UserController = void 0;
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class UserController {
    constructor(userUseCase, otpGenerator, encrypt) {
        this.userUseCase = userUseCase;
        this.otpGenerator = otpGenerator;
        this.encrypt = encrypt;
    }
    userRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, mobile, country, state, district, password } = req.body;
                console.log(req.body);
                const isUsernameExist = yield this.userUseCase.isUsernameExist(username);
                const isEmailExist = yield this.userUseCase.isEmailExist(email);
                if (isUsernameExist === null) {
                    if (isEmailExist === null) {
                        const OTP = this.otpGenerator.generateOTP();
                        // console.log(OTP,'OTP');
                        const securePassword = yield this.encrypt.encryptPassword(password);
                        const user = { username, email, mobile, country, state, district, password: securePassword, otp: OTP };
                        console.log(user);
                        const tempUser = yield this.userUseCase.saveUserTemporarily(user);
                        this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP);
                        // console.log('responding with 200');
                        res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ message: 'Success' });
                    }
                    else {
                        res.status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Email already Exist" });
                    }
                }
                else {
                    res.status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Username already Exist" });
                }
            }
            catch (error) {
                console.log(error);
                console.log('error while register');
            }
        });
    }
    validateUserOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('validating otp');
                console.log(req.body.otp, req.body.email);
                const { otp, email } = req.body;
                // console.log(authToken, 'authToken from validate otp');
                const user = yield this.userUseCase.findTempUserByEmail(email);
                if (user) {
                    console.log(user);
                    if (otp == user.otp) {
                        const savedData = yield this.userUseCase.saveUserDetails({
                            username: user.username,
                            email: user.email,
                            mobile: user.mobile,
                            country: user.country,
                            state: user.state,
                            district: user.district,
                            password: user.password
                        });
                        console.log('user details saved, setting status 200');
                        yield this.userUseCase.deleteTempUserByEmail(req.body.email);
                        res.status(savedData.status).json(savedData);
                    }
                    else {
                        console.log('otp didnt match');
                        res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid OTP' });
                    }
                }
                else {
                    res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'Timeout, Register again' });
                }
            }
            catch (error) {
                console.log(error);
                // next(error)
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("fasdfasd");
                const tempUser = yield this.userUseCase.findTempUserByEmail(req.body.email);
                if (tempUser) {
                    const OTP = this.otpGenerator.generateOTP();
                    // console.log(tempUser, 'userData');
                    console.log(OTP, 'new resend otp');
                    yield this.userUseCase.updateOtp(tempUser._id, tempUser.email, OTP);
                    this.userUseCase.sendTimeoutOTP(tempUser._id, tempUser.email, OTP);
                    res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ message: 'OTP has been sent' });
                }
                else {
                    res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json({ message: 'user timeout, register again' });
                }
            }
            catch (error) {
                const err = error;
                console.log(error);
                res.status(500).json({ message: err.message });
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const authData = yield this.userUseCase.verifyLogin(email, password);
                res.status(authData.status).json(authData);
            }
            catch (error) {
                console.log(error);
                // next(error)
            }
        });
    }
    // to get user data using userId
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.getUserData(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To update user details from profile
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.updateUserData(userId, user);
            res.status(apiRes.status).json(apiRes);
        });
    }
    updateUserProfileDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.params.userId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            console.log("Form Data:", req.body);
            console.log("File:", fileName);
            const apiRes = yield this.userUseCase.updateUserProfilePic(userId, fileName);
            res.status(apiRes.status).json(apiRes);
        });
    }
    removeUserProfileDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const apiRes = yield this.userUseCase.removeUserProfileDp(userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.UserController = UserController;
