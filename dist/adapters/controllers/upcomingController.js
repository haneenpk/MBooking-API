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
exports.UpcomingController = void 0;
const httpStatusCodes_1 = require("../../constants/httpStatusCodes");
class UpcomingController {
    constructor(upcomingUseCase) {
        this.upcomingUseCase = upcomingUseCase;
    }
    addUpcomingMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isMovienameExist = yield this.upcomingUseCase.isUpcomingMovienameExist(req.body.moviename);
                const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
                if (isMovienameExist === null) {
                    req.body.languages = req.body.languages.split(',');
                    req.body.genre = req.body.genre.split(',');
                    console.log("Form Data:", req.body);
                    console.log("File:", fileName);
                    const apiRes = yield this.upcomingUseCase.addUpcomingMovies(fileName, req.body);
                    res.status(apiRes.status).json(apiRes);
                }
                else {
                    yield this.upcomingUseCase.deleteImage(fileName);
                    res.status(httpStatusCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Movie name already Exist" });
                }
            }
            catch (error) {
                console.log(error);
                console.log('error while register');
            }
        });
    }
    getUpcomings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.upcomingUseCase.getUpcomings();
            res.status(apiRes.status).json(apiRes);
        });
    }
    deleteUpcomingMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const upcomingId = req.params.upcomingId;
            const apiRes = yield this.upcomingUseCase.deleteUpcomingMovies(upcomingId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    findUpcomingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const upcomingId = req.params.upcomingId;
            const upcomingMovieRes = yield this.upcomingUseCase.findUpcomingById(upcomingId);
            res.status(upcomingMovieRes.status).json(upcomingMovieRes);
        });
    }
    updateUpcomingMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const upcomingId = req.params.upcomingId;
            req.body.languages = req.body.languages.split(',');
            req.body.genre = req.body.genre.split(',');
            console.log("Form Data:", req.body, upcomingId);
            const upcomingMovieRes = yield this.upcomingUseCase.updateUpcomingMovies(upcomingId, req.body);
            // const upcomingMovieRes = await this.upcomingUseCase.findUpcomingById(upcomingId)
            res.status(upcomingMovieRes.status).json(upcomingMovieRes);
        });
    }
    updateUpcomingImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const upcomingId = req.params.upcomingId;
            const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            console.log("Form Data:", req.body);
            console.log("File:", fileName);
            const apiRes = yield this.upcomingUseCase.updateUpcomingImage(upcomingId, fileName);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.UpcomingController = UpcomingController;
