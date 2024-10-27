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
exports.ShowRepository = void 0;
const showModel_1 = require("../../entities/models/showModel");
const mongodb_1 = require("mongodb"); // Import ObjectId from MongoDB library
class ShowRepository {
    findShowById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findById({ _id: id });
        });
    }
    saveShow(showToSave) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new showModel_1.showModel(showToSave).save();
        });
    }
    editShow(showToEdit, showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findByIdAndUpdate({ _id: showId }, {
                $set: showToEdit
            }, { new: true });
        });
    }
    updatedAvailSeat(id, seatCount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findByIdAndUpdate({ _id: id }, { $inc: { availableSeatCount: seatCount } }, { new: true });
        });
    }
    findShowBySId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findById({ _id: id });
        });
    }
    findDates(currDate, theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.distinct("date", {
                date: { $gte: currDate },
                theaterId: theaterId
            });
        });
    }
    findFirstShows(currDate, theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the time component of currDate to midnight
            const startOfDay = new Date(currDate);
            startOfDay.setHours(0, 0, 0, 0);
            console.log("strt", startOfDay);
            // Find shows for the current date
            return yield showModel_1.showModel.find({
                date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }, // Matches dates within the current day
                theaterId: theaterId
            });
        });
    }
    getCollidingShowsOnTheScreen(screenId, startTime, endTime, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.find({
                screenId,
                $or: [
                    {
                        $and: [
                            { "startTime.hour": { $lte: startTime.hour } },
                            { "startTime.minute": { $lte: startTime.minute } },
                            { "endTime.hour": { $gte: startTime.hour } },
                            { "endTime.minute": { $gte: startTime.minute } },
                            { date: date }
                        ]
                    },
                    {
                        $and: [
                            { "startTime.hour": { $gte: startTime.hour } },
                            { "startTime.minute": { $gte: startTime.minute } },
                            { "endTime.hour": { $lte: endTime.hour } },
                            { "endTime.minute": { $lte: endTime.minute } },
                            { date: date }
                        ]
                    },
                    {
                        $and: [
                            { "startTime.hour": { $lte: endTime.hour } },
                            { "startTime.minute": { $lte: endTime.minute } },
                            { "endTime.hour": { $gte: endTime.hour } },
                            { "endTime.minute": { $gte: endTime.minute } },
                            { date: date }
                        ]
                    }
                ]
            });
        });
    }
    getCollidingShowsOnTheEditScreen(screenId, startTime, endTime, date, showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.find({
                screenId,
                $or: [
                    {
                        $and: [
                            { _id: { $ne: showId } },
                            { "startTime.hour": { $lte: startTime.hour } },
                            { "startTime.minute": { $lte: startTime.minute } },
                            { "endTime.hour": { $gte: startTime.hour } },
                            { "endTime.minute": { $gte: startTime.minute } },
                            { date: date }
                        ]
                    },
                    {
                        $and: [
                            { _id: { $ne: showId } },
                            { "startTime.hour": { $gte: startTime.hour } },
                            { "startTime.minute": { $gte: startTime.minute } },
                            { "endTime.hour": { $lte: endTime.hour } },
                            { "endTime.minute": { $lte: endTime.minute } },
                            { date: date }
                        ]
                    },
                    {
                        $and: [
                            { _id: { $ne: showId } },
                            { "startTime.hour": { $lte: endTime.hour } },
                            { "startTime.minute": { $lte: endTime.minute } },
                            { "endTime.hour": { $gte: endTime.hour } },
                            { "endTime.minute": { $gte: endTime.minute } },
                            { date: date }
                        ]
                    }
                ]
            });
        });
    }
    selectedShow(theaterIds, currDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.aggregate([
                { $match: { theaterId: { $in: theaterIds }, date: { $gte: currDate } } },
                { $group: { _id: "$movieId" } },
                { $project: { _id: 0, movieId: "$_id" } }
            ]);
        });
    }
    selectedMovieShow(theaterIds, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.find({
                $and: [
                    { theaterId: { $in: theaterIds } },
                    { movieId: movieId }
                ]
            });
        });
    }
    findDatesUser(currDate, theaterIds, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.distinct("date", {
                $and: [
                    { theaterId: { $in: theaterIds } },
                    { movieId: new mongodb_1.ObjectId(movieId) }, // Convert movieId to ObjectId
                    { date: { $gte: currDate } }
                ]
            });
        });
    }
    findFirstShowsUser(currDate, theaterIds, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the time component of currDate to midnight
            const startOfDay = new Date(currDate);
            startOfDay.setHours(0, 0, 0, 0);
            // Find shows for the current date
            return yield showModel_1.showModel.find({
                $and: [
                    { theaterId: { $in: theaterIds } },
                    { movieId: new mongodb_1.ObjectId(movieId) },
                    { date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) } }
                ]
            }).populate('screenId');
        });
    }
    deleteShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showModel_1.showModel.findByIdAndDelete(showId);
        });
    }
}
exports.ShowRepository = ShowRepository;
