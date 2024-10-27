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
exports.MovieRepository = void 0;
const movieModel_1 = __importDefault(require("../../entities/models/movieModel"));
class MovieRepository {
    findMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findById({ _id: id });
        });
    }
    findMovieBySId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findById({ _id: id });
        });
    }
    findByMoviename(moviename) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findOne({ moviename });
        });
    }
    saveMovie(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new movieModel_1.default(formData).save();
        });
    }
    findMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.find();
        });
    }
    deleteMovies(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findByIdAndDelete(movieId);
        });
    }
    updateMovies(movieId, movie) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findByIdAndUpdate({ _id: movieId }, {
                moviename: movie.moviename,
                languages: movie.languages,
                genre: movie.genre,
                cast: movie.cast,
                description: movie.description,
                duration: movie.duration,
                type: movie.type,
                releaseDate: movie.releaseDate,
            }, { new: true });
        });
    }
    updateImage(movieId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.findByIdAndUpdate({ _id: movieId }, {
                $set: {
                    image: fileName
                }
            }, { new: true });
        });
    }
    selectedMovies(selectedShow) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield movieModel_1.default.find({
                _id: { $in: selectedShow },
            });
        });
    }
}
exports.MovieRepository = MovieRepository;
