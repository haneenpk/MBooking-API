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
exports.TheaterRepository = void 0;
const theaterModel_1 = require("../../entities/models/theaterModel");
class TheaterRepository {
    saveTheater(theater) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterData = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(theater))), { _id: undefined, otp: undefined });
            return yield new theaterModel_1.theaterModel(theaterData).save();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findById({ _id: id });
        });
    }
    findTheaters() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.find();
        });
    }
    selectedTheaters(country, district) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.find({
                $and: [
                    { "address.country": country },
                    { "address.district": district },
                ]
            });
        });
    }
    blockTheater(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theater = yield theaterModel_1.theaterModel.findById({ _id: theaterId });
                if (theater !== null) {
                    theater.isBlocked = !theater.isBlocked;
                    yield theater.save();
                }
                else {
                    throw Error('Something went wrong, theaterId did\'t received');
                }
            }
            catch (error) {
                throw Error('Error while blocking/unblocking user');
            }
        });
    }
    updateTheater(theaterId, theater) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, {
                name: theater.name,
                mobile: theater.mobile,
                address: theater.address
            }, { new: true });
        });
    }
    updateScreenCount(theaterId, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield theaterModel_1.theaterModel.findByIdAndUpdate({ _id: theaterId }, { $inc: { screenCount: count } }, { new: true });
        });
    }
}
exports.TheaterRepository = TheaterRepository;
