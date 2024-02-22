import express, { Router } from "express";
import UserController from "../controllers/user.controllers";
import { validateUserRegistration } from '../middlewares/user/user_validations';
const router: Router = express.Router();

router.get('/verify-email', UserController.verifyEmail);
router.post("/register", validateUserRegistration, UserController.Register);
router.post("/login", UserController.login);
router.post('/send-verification-email', UserController.sendVerificationEmail);
router.post("/send-restart-password-email", UserController.SendResetPasswordEmail);
router.patch('/update-password', UserController.updateExistPassword);


export default router;