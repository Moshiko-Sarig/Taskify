import nodemailer from 'nodemailer';
import { verifyEmailConfig , recoverPasswordConfig} from '../config/user.config';

export class EmailService {

    static async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const transporter = nodemailer.createTransport(verifyEmailConfig.emailTransport);
        const mailOptions = {
            from: verifyEmailConfig.emailFrom,
            to,
            subject,
            html,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    static getVerificationEmailHtml(token: string): string {
        return `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyEmailConfig.CLIENT_URL}/verify-email?token=${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
    `;
    }

    static getResetPasswordEmailHtml(token: string): string {
        return `
            <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
                <h1 style="font-size: 24px;">Password Reset</h1>
                <p>Click the button below to reset your password:</p>
                <a href="${recoverPasswordConfig.PASSWORD_RESET_URL}/?:${token}" style="display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </div>
        `;
    }
    
}
