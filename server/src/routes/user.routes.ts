import express, { Router } from "express";
import UserController from "../controllers/user.controllers";
import { validateUserRegistration } from '../middlewares/user/user_validations';
const router: Router = express.Router();

router.get('/verify-email', UserController.verifyEmail);
router.post("/register", validateUserRegistration, UserController.Register);
router.post("/login", UserController.login);
router.post('/send-verification-email', UserController.sendVerificationEmail);

// router.get('/verify-email', (req, res) => {
//     console.log(req.query.token); // Log the token to see what's received
//     
// });

export default router;