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
exports.AdminController = void 0;
class AdminController {
    constructor(adminUseCase, userUseCase, theaterUseCase) {
        this.adminUseCase = adminUseCase;
        this.userUseCase = userUseCase;
        this.theaterUseCase = theaterUseCase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const authData = yield this.adminUseCase.verifyLogin(email, password);
            res.status(authData.status).json(authData);
        });
    }
    getAdminData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.params.adminId;
            const apiRes = yield this.adminUseCase.getAdminData(adminId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To update user details from profile
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = req.body;
            const adminId = req.params.adminId;
            const apiRes = yield this.adminUseCase.updateAdminData(adminId, admin);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.userUseCase.getUsers();
            res.status(apiRes.status).json(apiRes);
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.userUseCase.blockUser(req.params.userId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getTheaters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.theaterUseCase.getTheaters();
            res.status(apiRes.status).json(apiRes);
        });
    }
    blockTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.theaterUseCase.blockTheater(req.params.theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.AdminController = AdminController;
