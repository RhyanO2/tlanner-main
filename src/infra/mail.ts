import nodemailer from 'nodemailer'

export const mailProvider = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth:{
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }


})
