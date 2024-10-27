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
exports.UpcomingRepository = void 0;
const upcomingModel_1 = __importDefault(require("../../entities/models/upcomingModel"));
class UpcomingRepository {
    findUpcomingMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findById({ _id: id });
        });
    }
    findUpcomingMovieBySId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findById({ _id: id });
        });
    }
    findByMoviename(moviename) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findOne({ moviename });
        });
    }
    saveUpcoming(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new upcomingModel_1.default(formData).save();
        });
    }
    findUpcomings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.find();
        });
    }
    deleteUpcomingMovies(upcomingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findByIdAndDelete(upcomingId);
        });
    }
    updateUpcomingMovies(upcomingId, upcomingMovie) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findByIdAndUpdate({ _id: upcomingId }, {
                moviename: upcomingMovie.moviename,
                languages: upcomingMovie.languages,
                genre: upcomingMovie.genre,
                description: upcomingMovie.description,
                releaseDate: upcomingMovie.releaseDate,
            }, { new: true });
        });
    }
    updateUpcomingImage(upcomingId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield upcomingModel_1.default.findByIdAndUpdate({ _id: upcomingId }, {
                $set: {
                    image: fileName
                }
            }, { new: true });
        });
    }
}
exports.UpcomingRepository = UpcomingRepository;
