"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSender = void 0;
const mailTransporter_1 = require("../infrastructure/config/mailTransporter");
const getMailTemplate_1 = require("../infrastructure/helperFunctions/getMailTemplate");
class MailSender {
    sendOTP(email, otp) {
        const template = (0, getMailTemplate_1.getOTPTemplate)(otp);
        const details = {
            from: process.env.EMAIL,
            to: email,
            subject: "Mbooking Verification",
            html: template
        };
        mailTransporter_1.mailTransporter.sendMail(details, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
}
exports.MailSender = MailSender;
