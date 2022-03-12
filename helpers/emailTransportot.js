import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('process.env.TRANSPORTER_USER', process.env.TRANSPORTER_USER);
console.log('process.env.TRANSPORTER_PASS', process.env.TRANSPORTER_PASS);

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export { sgMail };

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TRANSPORTER_USER, // generated ethereal user
    pass: process.env.TRANSPORTER_PASS, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
