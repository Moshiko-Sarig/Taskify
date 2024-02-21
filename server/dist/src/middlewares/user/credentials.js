"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
class Credentials {
    constructor(credentials) {
        this.email = credentials.email;
        this.password = credentials.password;
        this.username = credentials.username;
    }
    validate() {
        const result = Credentials.validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map((err) => err.message) : null;
    }
}
Credentials.validationSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email is required.',
    }),
    password: joi_1.default.string()
        .required()
        .min(3)
        .max(255)
        .messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 3 characters long.',
        'string.max': 'Password must be no longer than 255 characters.',
    }),
    username: joi_1.default.string()
        .required()
        .min(3)
        .max(50)
        .messages({
        'string.empty': 'username is required.',
        'string.min': 'username must be at least 3 characters long.',
        'string.max': 'username must be no longer than 50 characters.',
    }),
});
module.exports = Credentials;
