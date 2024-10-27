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
exports.MovieUseCase = void 0;
const console_1 = require("console");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class MovieUseCase {
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }
    isMovienameExist(moviename) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMovienameExist = yield this.movieRepository.findByMoviename(moviename);
            return isMovienameExist;
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
    addMovies(fileName, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                formData.image = fileName;
                const savedMovie = yield this.movieRepository.saveMovie(formData);
                console.log(savedMovie, 'saved screen from saveScreen Use Case');
                return (0, response_1.get200Response)(savedMovie);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movies = yield this.movieRepository.findMovies();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: movies
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
    deleteMovies(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.movieRepository.findMovieById(movieId);
                const filePath = path_1.default.join(__dirname, `../../${data === null || data === void 0 ? void 0 : data.image}`);
                fs_1.default.unlinkSync(filePath);
                yield this.movieRepository.deleteMovies(movieId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findMovieById(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movie = yield this.movieRepository.findMovieById(movieId);
                if (movie)
                    return (0, response_1.get200Response)(movie);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Upcoming Id missing');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateMovies(movieId, movie) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedMovie = yield this.movieRepository.updateMovies(movieId, movie);
                return (0, response_1.get200Response)(updatedMovie);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    updateImage(movieId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fileName)
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again');
                (0, console_1.log)(movieId, fileName, 'userId, filename from use case');
                const movie = yield this.movieRepository.findMovieBySId(movieId);
                // Deleting user dp if it already exist
                if (movie && movie.image) {
                    const filePath = path_1.default.join(__dirname, `../../${movie.image}`);
                    fs_1.default.unlinkSync(filePath);
                }
                const updatedMovieImage = yield this.movieRepository.updateImage(movieId, fileName);
                if (updatedMovieImage)
                    return (0, response_1.get200Response)(updatedMovieImage);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid userId');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.MovieUseCase = MovieUseCase;
