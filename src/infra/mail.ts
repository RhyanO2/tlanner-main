import nodemailer from 'nodemailer';

export const mailProvider = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 2587,
  secure: false,
  auth: {
    user: 'resend',
    pass: process.env.MAIL_KEY,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
 