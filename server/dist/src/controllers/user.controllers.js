"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_config_1 = require("../config/user.config");
const cookie_enum_1 = require("../middlewares/cookie.enum");
const application_error_1 = __importDefault(require("../errors/application.error"));
const email_service_1 = require("../services/email.service");
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
            next(error);
        }
    }
    static async login(req, res, next) {
        const { username, email, password } = req.body;
        if (!(email || username) || !password) {
            throw new application_error_1.default('Email/Username and password are required.', 400);
        }
        try {
            const user = await user_model_1.default.login({ username, email, password });
            if (!user) {
                throw new application_error_1.default('Incorrect login information. Please try again.', 401);
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '30min' });
            res.cookie(cookie_enum_1.CookieEnum.Taskify_Cookie, token, {
                maxAge: 30 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
            res.json({ success: true, user: { id: user.id, first_name: user.first_name }, token });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async verifyEmail(req, res, next) {
        try {
            const token = req.query.token;
            if (typeof token !== 'string') {
                throw new application_error_1.default('Invalid token', 400);
            }
            jsonwebtoken_1.default.verify(token, user_config_1.verifyEmailConfig.EMAIL_SECRET, async (err, decoded) => {
                if (err || !decoded || typeof decoded === 'string') {
                    throw new application_error_1.default('Invalid or expired verification token', 400);
                }
                const jwtPayload = decoded;
                const userId = jwtPayload.id;
                if (!jwtPayload.id) {
                    throw new application_error_1.default('Invalid or expired verification token', 400);
                }
                await user_model_1.default.updateUserEmailVerified(userId, true);
                res.status(200).redirect('http://localhost:5173/email-verified');
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async sendVerificationEmail(req, res, next) {
        try {
            const { email } = req.body;
            const emailExists = await user_model_1.default.checkIfEmailExists(email);
            if (emailExists.length === 0) {
                throw new application_error_1.default('User not found', 404);
            }
            const token = jsonwebtoken_1.default.sign({ id: emailExists[0].user_id }, user_config_1.verifyEmailConfig.EMAIL_SECRET, { expiresIn: '10min' });
            const emailHtml = email_service_1.EmailService.getVerificationEmailHtml(token);
            await email_service_1.EmailService.sendEmail(email, 'Email Verification', emailHtml);
            res.json({ message: 'Verification email sent successfully.' });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    static async SendResetPasswordEmail(req, res, next) {
        try {
            const { email } = req.body;
            const emailExists = await user_model_1.default.checkIfEmailExists(email);
            if (emailExists.length === 0) {
                throw new application_error_1.default('User not found', 404);
            }
            const token = jsonwebtoken_1.default.sign({ id: emailExists[0].user_id }, user_config_1.recoverPasswordConfig.EMAIL_SECRET, { expiresIn: '10min' });
            const emailHtml = email_service_1.EmailService.getResetPasswordEmailHtml(token);
            await email_service_1.EmailService.sendEmail(email, 'Password Reset', emailHtml);
            res.json({ message: 'Password reset email sent' });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    static async updateExistPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            jsonwebtoken_1.default.verify(token, user_config_1.recoverPasswordConfig.EMAIL_SECRET, async (err, decoded) => {
                if (err || !decoded || typeof decoded === 'string') {
                    throw new application_error_1.default('Invalid or expired reset token', 400);
                }
                const jwtPayload = decoded;
                const userId = jwtPayload.id;
                if (!jwtPayload.id) {
                    throw new application_error_1.default('Invalid token payload', 400);
                }
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash(password, salt);
                await user_model_1.default.updateUserPassword(userId, hashedPassword);
                res.status(200).json({ message: 'Password updated successfully' });
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = UserController;
