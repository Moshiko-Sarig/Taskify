"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_config_1 = require("../config/user.config");
class EmailService {
    static async sendEmail(to, subject, html) {
        const transporter = nodemailer_1.default.createTransport(user_config_1.verifyEmailConfig.emailTransport);
        const mailOptions = {
            from: user_config_1.verifyEmailConfig.emailFrom,
            to,
            subject,
            html,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    static getVerificationEmailHtml(token) {
        return `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${user_config_1.verifyEmailConfig.CLIENT_URL}/verify-email?token=${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
    `;
    }
    static getResetPasswordEmailHtml(token) {
        return `
            <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
                <h1 style="font-size: 24px;">Password Reset</h1>
                <p>Click the button below to reset your password:</p>
                <a href="${user_config_1.recoverPasswordConfig.PASSWORD_RESET_URL}/?:${token}" style="display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </div>
        `;
    }
}
exports.EmailService = EmailService;
