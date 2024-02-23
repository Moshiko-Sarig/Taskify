import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyEmailConfig, recoverPasswordConfig } from '../config/user.config';
import { JwtPayload } from 'jsonwebtoken';
import { CookieEnum } from '../middlewares/cookie.enum';
import ApplicationError from '../errors/application.error';
import { EmailService } from '../services/email.service';




class UserController {

  static async Register(req: Request, res: Response, next: NextFunction,) {
    try {
      const user = req.body;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await UserModel.addUser(user);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;
    if (!(email || username) || !password) {
      throw new ApplicationError('Email/Username and password are required.', 400);
    }
    try {
      const user = await UserModel.login({ username, email, password });
      if (!user) {
        throw new ApplicationError('Incorrect login information. Please try again.', 401);
      }
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET as string, { expiresIn: '30min' });
      res.cookie(CookieEnum.Taskify_Cookie, token, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.json({ success: true, user: { id: user.id, first_name: user.first_name }, token });
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token;
      if (typeof token !== 'string') {
        throw new ApplicationError('Invalid token', 400);
      }
      jwt.verify(token, verifyEmailConfig.EMAIL_SECRET, async (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          throw new ApplicationError('Invalid or expired verification token', 400);
        }
        const jwtPayload = decoded as JwtPayload;
        const userId = jwtPayload.id;
        if (!jwtPayload.id) {
          throw new ApplicationError('Invalid or expired verification token', 400);
        }
        await UserModel.updateUserEmailVerified(userId, true);
        res.status(200).redirect('http://localhost:5173/email-verified');
      });
    } catch (error) {
      next(error);

    }
  }


  static async sendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const emailExists = await UserModel.checkIfEmailExists(email);
      if (emailExists.length === 0) {
        throw new ApplicationError('User not found', 404);
      }
      const token = jwt.sign({ id: emailExists[0].user_id }, verifyEmailConfig.EMAIL_SECRET, { expiresIn: '10min' });
      const emailHtml = EmailService.getVerificationEmailHtml(token);

      await EmailService.sendEmail(email, 'Email Verification', emailHtml);

      res.json({ message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  static async SendResetPasswordEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const emailExists = await UserModel.checkIfEmailExists(email);
      if (emailExists.length === 0) {
        throw new ApplicationError('User not found', 404);
      }
      const token = jwt.sign({ id: emailExists[0].user_id }, recoverPasswordConfig.EMAIL_SECRET, { expiresIn: '10min' });
      const emailHtml = EmailService.getResetPasswordEmailHtml(token);

      await EmailService.sendEmail(email, 'Password Reset', emailHtml);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async updateExistPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      jwt.verify(token, recoverPasswordConfig.EMAIL_SECRET, async (err: any, decoded: any) => {
        if (err || !decoded || typeof decoded === 'string') {
          throw new ApplicationError('Invalid or expired reset token', 400);
        }
        const jwtPayload = decoded as JwtPayload;
        const userId = jwtPayload.id;
        if (!jwtPayload.id) {
          throw new ApplicationError('Invalid token payload', 400);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.updateUserPassword(userId, hashedPassword);
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (error) {
      next(error);
    }
  }

}

export default UserController;