"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailOptions = void 0;
const createEmailOptions = (email, token) => ({
    from: 'your-email@example.com',
    to: email,
    subject: 'Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
        <h1 style="font-size: 24px;">Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="http://your-client-url.com/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
      </div>
    `,
});
exports.createEmailOptions = createEmailOptions;
