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
exports.ShowSeatRepository = void 0;
const showSeatModel_1 = require("../../entities/models/showSeatModel");
class ShowSeatRepository {
    // Save new seat document for each show newly created
    saveShowSeat(showSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new showSeatModel_1.showSeatsModel(showSeat).save();
        });
    }
    // To get the document using _id
    findShowSeatByIdS(showSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showSeatModel_1.showSeatsModel.findById(showSeatId);
        });
    }
    findShowSeatById(showSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showSeatModel_1.showSeatsModel.findById(showSeatId);
        });
    }
    udateShowSeatById(showSeatId, showSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showSeatModel_1.showSeatsModel.updateOne({ _id: showSeatId }, { $set: showSeat });
        });
    }
    udateShowSeatByIdS(showSeatId, showSeat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showSeatModel_1.showSeatsModel.updateOne({ _id: showSeatId }, { $set: showSeat });
        });
    }
}
exports.ShowSeatRepository = ShowSeatRepository;
