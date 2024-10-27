"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailSchema_1 = require("./emailSchema");
const mobileSchema_1 = require("./mobileSchema");
const addressSchema_1 = require("../subSchema/addressSchema");
const baseTheaterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema_1.theaterAddressSchema,
        required: [true, 'Address is required']
    },
});
baseTheaterSchema.add(emailSchema_1.emailSchema);
baseTheaterSchema.add(mobileSchema_1.mobileSchema);
exports.default = baseTheaterSchema;
