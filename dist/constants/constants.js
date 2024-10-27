"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = exports.nameRegex = exports.userNameMaxLength = exports.userNameMinLength = exports.ZipRegex = exports.OTPRegex = exports.passwordMinLength = exports.emailRegex = exports.ALPHABETS = exports.NoRefundTime = exports.QuarterRefundTime = exports.HalfRefundTime = exports.ThreeQuarterRefundTime = exports.tempTokenExp = exports.accessTokenExp = exports.OTP_TIMER = void 0;
exports.OTP_TIMER = 1000 * 60 * 3;
exports.accessTokenExp = 10 * 24 * 60 * 60; // 10 days in seconds
exports.tempTokenExp = 10 * 60; // 10 min
// Time is in hours
exports.ThreeQuarterRefundTime = 48;
exports.HalfRefundTime = 24;
exports.QuarterRefundTime = 8;
exports.NoRefundTime = 4;
exports.ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
exports.passwordMinLength = 8;
exports.OTPRegex = '^[1-9][0-9]{3}$';
exports.ZipRegex = '^[1-9][0-9]{5}$';
exports.userNameMinLength = 3;
exports.userNameMaxLength = 20;
exports.nameRegex = '^[a-zA-Z ]{3,20}$';
exports.passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$';
