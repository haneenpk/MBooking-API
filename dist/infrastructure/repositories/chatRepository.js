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
exports.ChatRepository = void 0;
const chatModel_1 = require("../../entities/models/chatModel");
class ChatRepository {
    saveMessage(chatReqs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatModel_1.chatModel.findOneAndUpdate({
                userId: chatReqs.userId,
                theaterId: chatReqs.theaterId,
            }, {
                $push: {
                    messages: {
                        sender: chatReqs.sender,
                        message: chatReqs.message,
                        isRead: false
                    }
                }
            }, {
                new: true,
                upsert: true
            });
        });
    }
    getChatHistory(userId, theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatModel_1.chatModel.findOne({ userId, theaterId });
        });
    }
    getChatHistoryUpdate(userId, theaterId, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatModel_1.chatModel.findOneAndUpdate({
                $and: [
                    { userId: userId },
                    { theaterId: theaterId },
                ]
            }, { $set: { messages: messages } }, { new: true });
        });
    }
    getTheatersChattedWith(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allChats = yield chatModel_1.chatModel.find({ userId }).populate('theaterId');
            const theaters = allChats.map(chat => chat);
            return theaters;
        });
    }
    getUsersChattedWith(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allChats = yield chatModel_1.chatModel.find({ theaterId }).populate('userId');
            const users = allChats.map(chat => chat);
            return users;
        });
    }
}
exports.ChatRepository = ChatRepository;
