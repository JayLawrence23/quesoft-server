import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('process.env.TRANSPORTER_USER', process.env.TRANSPORTER_USER);

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
