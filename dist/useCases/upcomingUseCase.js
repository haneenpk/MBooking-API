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
exports.UpcomingUseCase = void 0;
const console_1 = require("console");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class UpcomingUseCase {
    constructor(upcomingRepository) {
        this.upcomingRepository = upcomingRepository;
    }
    isUpcomingMovienameExist(moviename) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpcomingMovienameExist = yield this.upcomingRepository.findByMoviename(moviename);
            return isUpcomingMovienameExist;
        });
    }
    deleteImage(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(__dirname, `../../${fileName}`);
                fs_1.default.unlinkSync(filePath);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addUpcomingMovies(fileName, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                formData.image = fileName;
                const savedUpcoming = yield this.upcomingRepository.saveUpcoming(formData);
                console.log(savedUpcoming, 'saved screen from saveScreen Use Case');
                return (0, response_1.get200Response)(savedUpcoming);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getUpcomings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const upcomings = yield this.upcomingRepository.findUpcomings();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: upcomings
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
    deleteUpcomingMovies(upcomingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.upcomingRepository.findUpcomingMovieById(upcomingId);
                const filePath = path_1.default.join(__dirname, `../../${data === null || data === void 0 ? void 0 : data.image}`);
                fs_1.default.unlinkSync(filePath);
                yield this.upcomingRepository.deleteUpcomingMovies(upcomingId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findUpcomingById(upcomingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const upcomingMovie = yield this.upcomingRepository.findUpcomingMovieById(upcomingId);
                if (upcomingMovie)
                    return (0, response_1.get200Response)(upcomingMovie);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Upcoming Id missing');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUpcomingMovies(upcomingId, upcomingMovie) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUpcoming = yield this.upcomingRepository.updateUpcomingMovies(upcomingId, upcomingMovie);
                return (0, response_1.get200Response)(updatedUpcoming);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateUpcomingImage(upcomingId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                (0, console_1.log)(upcomingId, fileName, 'userId, filename from use case');
                const upcoming = yield this.upcomingRepository.findUpcomingMovieBySId(upcomingId);
                // Deleting user dp if it already exist
                if (upcoming && upcoming.image) {
                    const filePath = path_1.default.join(__dirname, `../../${upcoming.image}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedUpcomingImage = yield this.upcomingRepository.updateUpcomingImage(upcomingId, fileName);
                if (updatedUpcomingImage)
                    return (0, response_1.get200Response)(updatedUpcomingImage);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.UpcomingUseCase = UpcomingUseCase;
