"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRegistration = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const credentials_1 = __importDefault(require("../middlewares/credentials")); // Adjust the import path as necessary
const validateUserRegistration = async (req, res, next) => {
    const { first_name, last_name, username, email, password } = req.body;
    // Instantiate Credentials with provided user details 
    const userCredentials = new credentials_1.default({ email, password, username }); // Assuming your class supports username now
    const validationErrors = userCredentials.validate();
    // Joi Validation for format and constraints
    if (validationErrors) {
        return res.status(400).json({ message: validationErrors.join(", ") });
    }
    // Check for missing fields
    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if email already exists
    const emailExists = await user_model_1.default.checkIfEmailExists(email);
    if (emailExists.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    // Check if username already exists
    const usernameExists = await user_model_1.default.checkIfUsernameExists(username);
    if (usernameExists.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    next(); // If everything is fine, proceed to the controller
};
exports.validateUserRegistration = validateUserRegistration;
