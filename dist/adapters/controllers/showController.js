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
exports.ShowController = void 0;
class ShowController {
    constructor(showUseCase) {
        this.showUseCase = showUseCase;
    }
    addShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showReqs = req.body;
            const apiRes = yield this.showUseCase.addShow(showReqs);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To find all the shows on a theater on a specific day
    findShowsOnTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const dateParam = req.query.date;
            if (!dateParam) {
                return res.status(400).json({ message: 'Date parameter is required.' });
            }
            const date = new Date(dateParam);
            console.log("date: ", date);
            const apiRes = yield this.showUseCase.findShowsOnTheater(theaterId, date);
            res.status(apiRes.status).json(apiRes);
        });
    }
    findFirstShowsOnTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.showUseCase.findFirstShowsOnTheater(theaterId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = req.query.country;
            const district = req.query.district;
            if (country === undefined || district === undefined) {
                // Handle the case where country or district is undefined
                res.status(400).json({ error: "Country and district are required." });
                return;
            }
            const getMovies = yield this.showUseCase.getMovies(country, district);
            res.status(getMovies.status).json(getMovies);
        });
    }
    getShows(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = req.query.country;
            const district = req.query.district;
            const movieId = req.query.movieId;
            if (country === undefined || district === undefined || movieId === undefined) {
                // Handle the case where country or district is undefined
                res.status(400).json({ error: "Country and district are required." });
                return;
            }
            const getMovies = yield this.showUseCase.getShows(country, district, movieId);
            res.status(getMovies.status).json(getMovies);
        });
    }
    getSelectShows(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = req.query.country;
            const district = req.query.district;
            const movieId = req.query.movieId;
            const dateParam = req.query.date;
            if (country === undefined || district === undefined || movieId === undefined || dateParam === undefined) {
                // Handle the case where country or district is undefined
                res.status(400).json({ error: "Country and district are required." });
                return;
            }
            const date = new Date(dateParam);
            const getSelectMovies = yield this.showUseCase.getSelectShows(country, district, date, movieId);
            res.status(getSelectMovies.status).json(getSelectMovies);
        });
    }
    editShowGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showId = req.params.showId;
                const getShow = yield this.showUseCase.editShowGet(showId);
                if (getShow !== undefined) {
                    res.status(getShow.status).json(getShow);
                }
                else {
                    // Handle the case when getShow is undefined
                    res.status(500).json({ message: "Error: Show data not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    editShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showId = req.params.showId;
            const showReqs = req.body;
            const apiRes = yield this.showUseCase.editShow(showReqs, showId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    deleteShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showId = req.params.showId;
            const apiRes = yield this.showUseCase.deleteShow(showId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.ShowController = ShowController;
