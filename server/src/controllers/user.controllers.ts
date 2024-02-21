import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Credentials from '../middlewares/user/credentials';
import { verifyEmailConfig, recoverPasswordConfig } from '../config/user.config';
import nodemailer from 'nodemailer';
import { JwtPayload } from 'jsonwebtoken';
import { CookieEnum } from '../middlewares/cookie.enum';
import { User } from '../models/user.model';
import ApplicationError from '../errors/application.error';
import { EmailService } from '../services/email.service';



class UserController {

  static async Register(req: Request, res: Response, next:NextFunction,) {
    try {
      const user = req.body;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await UserModel.addUser(user);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'SERVER ERROR!' });
    }
  }

  static async login(req: Request, res: Response) {
    try {

      const { username, email, password } = req.body;

      if (!(email || username) || !password) {
        return res.status(400).json({ message: 'Email/Username and password are required.' });
      }

      const user = await UserModel.login({ username, email, password });

      if (!user) {
        return res.status(401).json('Incorrect login information. Please try again.');
      }

      const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string, { expiresIn: '30min' });
      res.cookie(CookieEnum.Taskify_Cookie, token, {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }).json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async verifyEmail(req: Request, res: Response) {//change the status of the user email verify to true
    try {
      const token = req.query.token;
      if (typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid token' });
      }
      jwt.verify(token, verifyEmailConfig.EMAIL_SECRET, async (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          return res.status(400).json({ error: 'Invalid or expired verification token' });
        }
        const jwtPayload = decoded as JwtPayload;
        const userId = jwtPayload.id;
        if (!jwtPayload.id) {
          return res.status(400).json({ error: 'Invalid token payload' });
        }
        await UserModel.updateUserEmailVerified(userId, true);
        res.status(200).redirect('http://localhost:5173/email-verified');
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'SERVER ERROR!' });
    }
  }

  static async sendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const emailExists = await UserModel.checkIfEmailExists(email);
      if (emailExists.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const token = jwt.sign({ id: emailExists[0].user_id }, verifyEmailConfig.EMAIL_SECRET, { expiresIn: '10min' });
      const transporter = nodemailer.createTransport(verifyEmailConfig.emailTransport);
      const mailOptions = {
        from: verifyEmailConfig.emailFrom,
        to: email,
        subject: 'Email Verification',
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
            <h1 style="font-size: 24px;">Email Verification</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${verifyEmailConfig.CLIENT_URL}/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
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

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'SERVER ERROR!' });
    }
  }
//! PROBLEM: the palyod of the token is not good!!
  // static async sendVerificationEmail(req: Request, res: Response) {
  //   try {
  //     const { email } = req.body;
  //     const user = await UserModel.checkIfEmailExists(email);
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }

      
  //     const token = jwt.sign({ id: user.id }, verifyEmailConfig.EMAIL_SECRET, { expiresIn: '10min' });
  //     const emailHtml = EmailService.getVerificationEmailHtml(token);

  //     await EmailService.sendEmail(email, 'Email Verification', emailHtml);

  //     res.json({ message: 'Verification email sent successfully.' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, message: 'Server error.' });
  //   }
  // }

}

export default UserController;