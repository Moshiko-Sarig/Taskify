"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_config_1 = require("../config/user.config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const cookie_enum_1 = require("../middlewares/cookie.enum");
class UserController {
    static async Register(req, res, next) {
        try {
            const user = req.body;
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(user.password, salt);
            const newUser = await user_model_1.default.addUser(user);
            res.status(201).json({ success: true, user: newUser });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'SERVER ERROR!' });
        }
    }
    static async login(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!(email || username) || !password) {
                return res.status(400).json({ message: 'Email/Username and password are required.' });
            }
            const user = await user_model_1.default.login({ username, email, password });
            if (!user) {
                return res.status(401).json('Incorrect login information. Please try again.');
            }
            const token = jsonwebtoken_1.default.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '30min' });
            res.cookie(cookie_enum_1.CookieEnum.Taskify_Cookie, token, {
                maxAge: 30 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            }).json({ success: true, token });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const token = req.query.token;
            if (typeof token !== 'string') {
                return res.status(400).json({ error: 'Invalid token' });
            }
            jsonwebtoken_1.default.verify(token, user_config_1.verifyEmailConfig.EMAIL_SECRET, async (err, decoded) => {
                if (err || !decoded || typeof decoded === 'string') {
                    return res.status(400).json({ error: 'Invalid or expired verification token' });
                }
                const jwtPayload = decoded;
                const userId = jwtPayload.id;
                if (!jwtPayload.id) {
                    return res.status(400).json({ error: 'Invalid token payload' });
                }
                await user_model_1.default.updateUserEmailVerified(userId, true);
                res.status(200).redirect('http://localhost:5173/email-verified');
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'SERVER ERROR!' });
        }
    }
    static async sendVerificationEmail(req, res) {
        try {
            const { email } = req.body;
            const emailExists = await user_model_1.default.checkIfEmailExists(email);
            if (emailExists.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            const token = jsonwebtoken_1.default.sign({ id: emailExists[0].user_id }, user_config_1.verifyEmailConfig.EMAIL_SECRET, { expiresIn: '10min' });
            const transporter = nodemailer_1.default.createTransport(user_config_1.verifyEmailConfig.emailTransport);
            const mailOptions = {
                from: user_config_1.verifyEmailConfig.emailFrom,
                to: email,
                subject: 'Email Verification',
                html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
            <h1 style="font-size: 24px;">Email Verification</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${user_config_1.verifyEmailConfig.CLIENT_URL}/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
          </div>
        `,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Error sending email' });
                }
                res.json({ message: 'Verification email sent' });
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'SERVER ERROR!' });
        }
    }
}
exports.default = UserController;
