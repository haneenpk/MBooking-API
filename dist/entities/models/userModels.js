"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const emailSchema_1 = require("./base/emailSchema");
const mobileSchema_1 = require("./base/mobileSchema");
const walletSchema_1 = require("./base/walletSchema");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    profilePic: {
        type: String,
    }
});
userSchema.add(emailSchema_1.emailSchema);
userSchema.add(mobileSchema_1.mobileSchema);
userSchema.add(walletSchema_1.walletSchema);
const userModel = mongoose_1.default.model('Users', userSchema);
exports.default = userModel;
