import nodemailer from 'nodemailer';
import { verifyEmailConfig } from '../config/user.config';

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
}
