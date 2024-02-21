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
}
exports.EmailService = EmailService;
