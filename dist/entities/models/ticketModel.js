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
exports.ticketModel = exports.ticketSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ticketSeatSchema_1 = require("./subSchema/ticketSeatSchema");
exports.ticketSchema = new mongoose_1.Schema({
    showId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'showId is required'],
        ref: 'Shows'
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    },
    movieId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'movieId is required'],
        ref: 'Movies'
    },
    theaterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'theaterId is required'],
        ref: 'Theaters'
    },
    screenId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'screenId is required'],
        ref: 'Screens'
    },
    seats: {
        type: [mongoose_1.Schema.Types.Mixed],
        required: true
    },
    diamondSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    goldSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    silverSeats: ticketSeatSchema_1.ticketSeatCategorySchema,
    totalPrice: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    adminShare: {
        type: Number,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Stripe'],
        default: 'Stripe', // Delete after Implementation
        required: true
    }
}, {
    timestamps: true
});
exports.ticketModel = mongoose_1.default.model('Tickets', exports.ticketSchema);
