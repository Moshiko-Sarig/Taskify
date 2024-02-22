"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
const user_validations_1 = require("../middlewares/user/user_validations");
const router = express_1.default.Router();
router.get('/verify-email', user_controllers_1.default.verifyEmail);
router.post("/register", user_validations_1.validateUserRegistration, user_controllers_1.default.Register);
router.post("/login", user_controllers_1.default.login);
router.post('/send-verification-email', user_controllers_1.default.sendVerificationEmail);
router.post("/send-restart-password-email", user_controllers_1.default.SendResetPasswordEmail);
router.patch('/update-password', user_controllers_1.default.updateExistPassword);
exports.default = router;
