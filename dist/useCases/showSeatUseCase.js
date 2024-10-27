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
exports.ShowSeatUseCase = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const response_1 = require("../infrastructure/helperFunctions/response");
class ShowSeatUseCase {
    constructor(showSeatRepository) {
        this.showSeatRepository = showSeatRepository;
    }
    findShowSeatById(showSeatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showSeat = yield this.showSeatRepository.findShowSeatById(showSeatId);
                if (showSeat)
                    return (0, response_1.get200Response)(showSeat);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST, 'Screen Id missing');
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ShowSeatUseCase = ShowSeatUseCase;
