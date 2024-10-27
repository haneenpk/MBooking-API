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
exports.MovieController = void 0;
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class MovieController {
    constructor(movieUseCase) {
        this.movieUseCase = movieUseCase;
    }
    addMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isMovienameExist = yield this.movieUseCase.isMovienameExist(req.body.moviename);
                const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                if (isMovienameExist === null) {
                    req.body.languages = req.body.languages.split(',');
                    req.body.genre = req.body.genre.split(',');
                    req.body.cast = req.body.cast.split(',');
                    console.log("Form Data:", req.body);
                    console.log("File:", fileName);
                    const apiRes = yield this.movieUseCase.addMovies(fileName, req.body);
                    res.status(apiRes.status).json(apiRes);
                }
                else {
                    yield this.movieUseCase.deleteImage(fileName);
                    res.status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Movie name already Exist" });
                }
            }
            catch (error) {
                console.log(error);
                console.log('error while register');
            }
        });
    }
    getMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.movieUseCase.getMovies();
            res.status(apiRes.status).json(apiRes);
        });
    }
    deleteMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            const apiRes = yield this.movieUseCase.deleteMovies(movieId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    findMovieById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            const movieRes = yield this.movieUseCase.findMovieById(movieId);
            res.status(movieRes.status).json(movieRes);
        });
    }
    updateMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            req.body.languages = req.body.languages.split(',');
            req.body.genre = req.body.genre.split(',');
            console.log("Form Data:", req.body, movieId);
            const movieRes = yield this.movieUseCase.updateMovies(movieId, req.body);
            // const upcomingMovieRes = await this.upcomingUseCase.findUpcomingById(upcomingId)
            res.status(movieRes.status).json(movieRes);
        });
    }
    updateImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const movieId = req.params.movieId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            console.log("Form Data:", req.body);
            console.log("File:", fileName);
            const apiRes = yield this.movieUseCase.updateImage(movieId, fileName);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.MovieController = MovieController;
