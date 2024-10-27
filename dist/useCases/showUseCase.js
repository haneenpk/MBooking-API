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
exports.ShowUseCase = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
const getMovieEnding_1 = require("../infrastructure/helperFunctions/getMovieEnding");
const showSeat_1 = require("../infrastructure/helperFunctions/showSeat");
class ShowUseCase {
    constructor(showRepository, showSeatRepository, movieRepository, screenRepository, screenSeatRepository, theaterRepository) {
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.screenSeatRepository = screenSeatRepository;
        this.theaterRepository = theaterRepository;
    }
    addShow(show) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!show.movieId || !show.screenId || !show.startTime || !show.date) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing');
                }
                const movie = yield this.movieRepository.findMovieById(show.movieId);
                if (movie !== null) {
                    const showDate = new Date(show.date);
                    const releaseDate = new Date(movie.releaseDate);
                    if (showDate >= releaseDate) {
                        const endingTime = (0, getMovieEnding_1.getEndingTime)(show.startTime, movie.duration);
                        console.log(endingTime);
                        const collidedShows = yield this.showRepository.getCollidingShowsOnTheScreen(show.screenId, endingTime[0], endingTime[1], show.date);
                        if (collidedShows.length === 0) {
                            const screen = yield this.screenRepository.findScreenById(show.screenId);
                            if (screen) {
                                const screenSeat = yield this.screenSeatRepository.findScreenSeatById(screen.seatId);
                                if (screenSeat) {
                                    const showSeatToSave = (0, showSeat_1.createEmptyShowSeat)(screenSeat, show.diamondPrice, show.goldPrice, show.silverPrice);
                                    const savedShowSeat = yield this.showSeatRepository.saveShowSeat(showSeatToSave);
                                    const showToSave = {
                                        theaterId: screen.theaterId,
                                        movieId: movie._id,
                                        screenId: screen._id,
                                        date: show.date,
                                        startTime: endingTime[0],
                                        endTime: endingTime[1],
                                        totalSeatCount: screen.seatsCount,
                                        availableSeatCount: screen.seatsCount,
                                        seatId: savedShowSeat._id
                                    };
                                    const savedShow = yield this.showRepository.saveShow(showToSave);
                                    return (0, response_1.get200Response)(savedShow);
                                }
                                else {
                                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing');
                                }
                            }
                            else {
                                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing');
                            }
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.CONFLICT, 'Show already exists at the same time.');
                        }
                    }
                    else {
                        // Format releaseDate to desired format
                        const formattedReleaseDate = releaseDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, `Movie will be released after ${formattedReleaseDate} date.`);
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid movie id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    editShow(show, showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!show.movieId || !show.screenId || !show.startTime || !show.date) {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing');
                }
                const movie = yield this.movieRepository.findMovieById(show.movieId);
                if (movie !== null) {
                    const showDate = new Date(show.date);
                    const releaseDate = new Date(movie.releaseDate);
                    if (showDate >= releaseDate) {
                        const endingTime = (0, getMovieEnding_1.getEndingTime)(show.startTime, movie.duration);
                        console.log(endingTime);
                        const collidedShows = yield this.showRepository.getCollidingShowsOnTheEditScreen(show.screenId, endingTime[0], endingTime[1], show.date, showId);
                        if (collidedShows.length === 0) {
                            const screen = yield this.screenRepository.findScreenById(show.screenId);
                            if (screen) {
                                const screenSeat = yield this.screenSeatRepository.findScreenSeatById(screen.seatId);
                                if (screenSeat) {
                                    // const showSeatToSave = createEmptyShowSeat(screenSeat, show.diamondPrice, show.goldPrice, show.silverPrice);
                                    // const savedShowSeat = await this.showSeatRepository.saveShowSeat(showSeatToSave);
                                    const showToEdit = {
                                        theaterId: screen.theaterId,
                                        movieId: movie._id,
                                        screenId: screen._id,
                                        date: show.date,
                                        startTime: endingTime[0],
                                        endTime: endingTime[1],
                                        totalSeatCount: screen.seatsCount,
                                        availableSeatCount: screen.seatsCount,
                                    };
                                    const editShow = yield this.showRepository.editShow(showToEdit, showId);
                                    return (0, response_1.get200Response)(editShow);
                                }
                                else {
                                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing');
                                }
                            }
                            else {
                                return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing');
                            }
                        }
                        else {
                            return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.CONFLICT, 'Show already exists at the same time.');
                        }
                    }
                    else {
                        // Format releaseDate to desired format
                        const formattedReleaseDate = releaseDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                        return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, `Movie will be released after ${formattedReleaseDate} date.`);
                    }
                }
                else {
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Invalid movie id');
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findShowsOnTheater(theaterId, dateStr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(dateStr, theaterId);
                const FirstShow = yield this.showRepository.findFirstShows(dateStr, theaterId);
                console.log(FirstShow);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    FirstShow
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findFirstShowsOnTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                const dates = yield this.showRepository.findDates(today, theaterId);
                const FirstShow = yield this.showRepository.findFirstShows(currentDate, theaterId);
                console.log(dates, FirstShow);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    dates,
                    FirstShow
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getMovies(country, district) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const availableTheater = yield this.theaterRepository.selectedTheaters(country, district);
                // Assuming availableTheater is an array of objects with an _id property of type ObjectId
                let arrTheater = [];
                for (let i = 0; i < availableTheater.length; i++) {
                    arrTheater.push(availableTheater[i]._id);
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedShow = yield this.showRepository.selectedShow(arrTheater, today);
                let arrShow = [];
                for (let i = 0; i < selectedShow.length; i++) {
                    arrShow.push(selectedShow[i].movieId);
                }
                const selectedMovies = yield this.movieRepository.selectedMovies(arrShow);
                return (0, response_1.get200Response)(selectedMovies);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getShows(country, district, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const availableTheater = yield this.theaterRepository.selectedTheaters(country, district);
                // Assuming availableTheater is an array of objects with an _id property of type ObjectId
                let arrTheater = [];
                for (let i = 0; i < availableTheater.length; i++) {
                    arrTheater.push(availableTheater[i]._id);
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                const dates = yield this.showRepository.findDatesUser(today, arrTheater, movieId);
                dates.sort((a, b) => a.getTime() - b.getTime());
                const selectedShow = yield this.showRepository.findFirstShowsUser(dates[0], arrTheater, movieId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    dates,
                    selectedShow
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getSelectShows(country, district, dateStr, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const availableTheater = yield this.theaterRepository.selectedTheaters(country, district);
                // Assuming availableTheater is an array of objects with an _id property of type ObjectId
                let arrTheater = [];
                for (let i = 0; i < availableTheater.length; i++) {
                    arrTheater.push(availableTheater[i]._id);
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedShow = yield this.showRepository.findFirstShowsUser(dateStr, arrTheater, movieId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    selectedShow
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    editShowGet(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                let editShow = yield this.showRepository.findShowBySId(showId);
                if (editShow !== null) {
                    console.log(editShow.seatId, typeof editShow.seatId);
                    const editShowScreen = yield this.showSeatRepository.findShowSeatByIdS(editShow.seatId);
                    if (editShowScreen !== null) {
                        editShow.diamond = (_a = editShowScreen.diamond) === null || _a === void 0 ? void 0 : _a.price;
                        editShow.gold = (_b = editShowScreen.gold) === null || _b === void 0 ? void 0 : _b.price;
                        editShow.silver = (_c = editShowScreen.silver) === null || _c === void 0 ? void 0 : _c.price;
                        console.log(editShowScreen);
                        return {
                            status: httpStatusCodes_1.STATUS_CODES.OK,
                            message: 'Success',
                            editShow,
                            editShowScreen
                        };
                    }
                    else {
                        console.log("Show seat not found");
                        // Handle the case when editShowScreen is null
                        // You can return an appropriate response or throw an error here
                    }
                }
                else {
                    console.log("Edit show not found");
                    // Handle the case when editShow is null
                    // You can return an appropriate response or throw an error here
                }
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    deleteShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.showRepository.deleteShow(showId);
                return (0, response_1.get200Response)(null);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ShowUseCase = ShowUseCase;
