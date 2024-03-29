export const OTP_TIMER = 1000 * 60 * 3  
export const accessTokenExp = 10 * 24 * 60 * 60; // 10 days in seconds
export const tempTokenExp = 10 * 60 // 10 min

// Time is in hours
export const ThreeQuarterRefundTime = 48
export const HalfRefundTime = 24
export const QuarterRefundTime = 8
export const NoRefundTime = 4

export const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
export const passwordMinLength = 8
export const OTPRegex = '^[1-9][0-9]{3}$'
export const ZipRegex = '^[1-9][0-9]{5}$'
export const userNameMinLength = 3
export const userNameMaxLength = 20
export const nameRegex = '^[a-zA-Z ]{3,20}$'
export const passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'