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
exports.ChatUseCase = void 0;
const response_1 = require("../infrastructure/helperFunctions/response");
class ChatUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    sendMessage(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield this.chatRepository.saveMessage(chatData);
                return (0, response_1.get200Response)(savedMessage);
            }
            catch (error) {
                console.log(error, 'error while saving chat message');
                throw Error('error while saving message');
            }
        });
    }
    getChatHistory(userId, theaterId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield this.chatRepository.getChatHistory(userId, theaterId);
                if (chats && chats.messages !== undefined) { // Check if chats is not null or undefined
                    for (let i = 0; i < chats.messages.length; i++) {
                        if (chats.messages[i].sender === role) {
                            console.log("send: ", chats.messages[i].sender === role);
                            chats.messages[i].isRead = true;
                        }
                    }
                }
                const updated = yield this.chatRepository.getChatHistoryUpdate(userId, theaterId, chats === null || chats === void 0 ? void 0 : chats.messages);
                return (0, response_1.get200Response)(updated); // handle it from front end
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getTheatersChattedWith(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.chatRepository.getTheatersChattedWith(userId);
                console.log(users);
                return (0, response_1.get200Response)(users);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getUsersChattedWith(theaterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.chatRepository.getUsersChattedWith(theaterId);
                return (0, response_1.get200Response)(users);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
}
exports.ChatUseCase = ChatUseCase;
