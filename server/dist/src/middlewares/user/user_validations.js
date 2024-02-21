"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRegistration = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const credentials_1 = __importDefault(require("./credentials"));
const validateUserRegistration = async (req, res, next) => {
    const { first_name, last_name, username, email, password } = req.body;
    const userCredentials = new credentials_1.default({ email, password, username });
    const validationErrors = userCredentials.validate();
    if (validationErrors) {
        return res.status(400).json({ message: validationErrors.join(", ") });
    }
    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const emailExists = await user_model_1.default.checkIfEmailExists(email);
    if (emailExists.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const usernameExists = await user_model_1.default.checkIfUsernameExists(username);
    if (usernameExists.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    next();
};
exports.validateUserRegistration = validateUserRegistration;
