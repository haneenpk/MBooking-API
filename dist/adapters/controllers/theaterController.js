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
exports.TheaterController = void 0;
class TheaterController {
    constructor(theaterUseCase) {
        this.theaterUseCase = theaterUseCase;
    }
    // To save non-verified theater data temporarily and send otp for verification
    theaterRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, mobile, password } = req.body;
            const { country, state, district, city } = req.body;
            const address = { country, state, district, city };
            const theaterData = { name, email, mobile, password, address, otp: 0 };
            const authRes = yield this.theaterUseCase.verifyAndSaveTemporarily(theaterData);
            res.status(authRes.status).json(authRes);
        });
    }
    // To validate otp during registration
    validateTheaterOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            const validationRes = yield this.theaterUseCase.validateAndSaveTheater(otp, email);
            res.status(validationRes.status).json(validationRes);
        });
    }
    // To resend otp if current one is already expired
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const authToken = req.headers.authorization;
            const { email } = req.body;
            const apiRes = yield this.theaterUseCase.verifyAndSendNewOTP(email);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To authenticate theater login using email and password
    theaterLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const authData = yield this.theaterUseCase.verifyLogin(email, password);
            res.status(authData.status).json(authData);
        });
    }
    // to update a theater data, used in profile edit
    updateTheaterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const { address, mobile, name } = req.body;
            const theater = { name, mobile, address };
            const apiRes = yield this.theaterUseCase.updateTheater(theaterId, theater);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To get all the data of a theater using theater id
    getTheaterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.theaterUseCase.getTheaterData(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAllTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.theaterUseCase.getAllTheater();
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.TheaterController = TheaterController;
