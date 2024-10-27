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
exports.showModel = exports.showSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.showSchema = new mongoose_1.Schema({
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Theaters',
        required: true
    },
    movieId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Movies',
        required: true
    },
    screenId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Screens',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        }
    },
    endTime: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        }
    },
    totalSeatCount: {
        type: Number,
        required: true
    },
    availableSeatCount: {
        type: Number,
        required: true
    },
    seatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ShowSeats',
        required: true,
        unique: true,
        // immutable: [true, 'Changing seatId is forbidden']
    }
});
exports.showModel = mongoose_1.default.model('Shows', exports.showSchema);
