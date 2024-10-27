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
exports.AdminUseCase = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
class AdminUseCase {
    constructor(encrypt, adminRepository, jwtToken) {
        this.encrypt = encrypt;
        this.adminRepository = adminRepository;
        this.jwtToken = jwtToken;
    }
    verifyLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.adminRepository.findAdmin();
            if (adminData !== null) {
                if (adminData.email === email) {
                    const passwordMatch = yield this.encrypt.comparePasswords(password, adminData.password);
                    if (passwordMatch) {
                        const accessToken = this.jwtToken.generateAccessToken(adminData._id);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: 'Success',
                            data: adminData,
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
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        message: 'Invalid Email',
                        data: null,
                        accessToken: '',
                    };
                }
            }
            else {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                    message: 'Invalid Email or Password',
                    data: null,
                    accessToken: '',
                };
            }
        });
    }
    getAdminData(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminRepository.getAdminData(adminId);
                if (admin)
                    return (0, response_1.get200Response)(admin);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateAdminData(adminId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAdmin = yield this.adminRepository.updateAdmin(adminId, admin);
                return (0, response_1.get200Response)(updatedAdmin);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
