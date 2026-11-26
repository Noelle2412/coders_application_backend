import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateVerificationToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: role,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Create reusable transporter (supports SMTP via .env, or falls back to Ethereal / console logging)
let transporterPromise = null;

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
    );
    return transporterPromise;
  }

  // Create ethereal test account for development if no SMTP credentials provided
  transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  });

  return transporterPromise;
};

export const sendVerificationEmail = async ({ to, firstName, token }) => {
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  const transporter = await getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Coders App" <no-reply@codersapp.com>',
    to,
    subject: "Verify Your Account - Coders App",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1a202c; margin-bottom: 16px;">Welcome to Coders App, ${firstName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
          Thank you for registering. Please verify your email address to activate your account.
        </p>
        <div style="margin: 28px 0;">
          <a href="${verificationLink}" style="background-color: #3182ce; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #718096; font-size: 14px; line-height: 1.5;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verificationLink}" style="color: #3182ce; word-break: break-all;">${verificationLink}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 24px 0;" />
        <p style="color: #a0aec0; font-size: 12px;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(
    `[Email] Verification email sent to ${to}. MessageId: ${info.messageId}`,
  );
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Email] Ethereal Preview URL: ${previewUrl}`);
  }
  return info;
};
