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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theaterModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mobileSchema_1 = require("./base/mobileSchema");
const baseTheaterSchema_1 = __importDefault(require("./base/baseTheaterSchema"));
const theaterSchema = new mongoose_1.Schema({
    profilePic: String,
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    },
    screenCount: {
        type: Number,
        default: 0,
        required: true
    },
}, {
    timestamps: true
});
theaterSchema.add(baseTheaterSchema_1.default);
theaterSchema.add(mobileSchema_1.mobileSchema);
theaterSchema.index({ 'coords': '2dsphere' });
theaterSchema.index({ name: 'text' });
exports.theaterModel = mongoose_1.default.model('Theaters', theaterSchema);
