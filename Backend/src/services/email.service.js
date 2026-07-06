import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS,
  },
});

/**
 * Send a password reset email
 * @param {string} email - Recipient email
 * @param {string} fullname - User's full name
 * @param {string} token - Reset token
 */
export const sendResetPasswordEmail = async (email, fullname, token) => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"SILQ" <${config.EMAIL.FROM}>`,
    to: email,
    subject: "🔑 Reset Your SILQ Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #F5C451; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; }
          .logo span:first-child { color: #2B2B2B; }
          .logo span:last-child { color: #F5C451; }
          .content { padding: 20px 0; }
          .btn { display: inline-block; background-color: #F5C451; color: #2B2B2B; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .btn:hover { background-color: #e6b33d; }
          .footer { text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
          .expiry { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <span>SI</span><span>LQ</span>
            </div>
            <p style="color: #666; margin: 5px 0 0;">Password Reset</p>
          </div>
          
          <div class="content">
            <h2>Hi ${fullname},</h2>
            <p>We received a request to reset your password for your SILQ account.</p>
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Or copy this link into your browser:<br>
              <span style="word-break: break-all; color: #F5C451;">${resetUrl}</span>
            </p>
            
            <p class="expiry">⏰ This link will expire in <strong>15 minutes</strong>.</p>
            
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 SILQ. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send reset email");
  }
};