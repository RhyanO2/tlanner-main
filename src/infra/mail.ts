import nodemailer from 'nodemailer';

export const mailProvider = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.MAIL_KEY,
  },
});
