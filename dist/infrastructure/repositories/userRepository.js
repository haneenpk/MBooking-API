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
exports.UserRepository = void 0;
const userModels_1 = __importDefault(require("../../entities/models/userModels"));
class UserRepository {
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('on user repository saving user');
            return yield new userModels_1.default(user).save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findById({ _id: id });
        });
    }
    findByIdNS(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findById({ _id: id });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findOne({ email });
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findOne({ username });
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.find();
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModels_1.default.findById({ _id: userId });
                if (user !== null) {
                    user.isBlocked = !user.isBlocked;
                    yield user.save();
                }
                else {
                    throw Error('Something went wrong, userId didt received');
                }
            }
            catch (error) {
                throw Error('Error while blocking/unblocking user');
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findById(userId);
        });
    }
    updateUser(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findByIdAndUpdate({ _id: userId }, {
                username: user.username,
                mobile: user.mobile,
            }, { new: true });
        });
    }
    updateUserProfilePic(userId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findByIdAndUpdate({ _id: userId }, {
                $set: {
                    profilePic: fileName
                }
            }, { new: true });
        });
    }
    removeUserProfileDp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModels_1.default.findByIdAndUpdate({ _id: userId }, {
                $unset: {
                    profilePic: ''
                }
            }, { new: true });
        });
    }
    updateWallet(userId, amount, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId, 'userID from update wallet of user');
            return yield userModels_1.default.findByIdAndUpdate({ _id: userId }, {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount, message } }
            }, { new: true });
        });
    }
}
exports.UserRepository = UserRepository;
