const nodemailer = require("nodemailer");
const express = require('express');
const { configDotenv } = require("dotenv");
const app = express();
app.use(express.json());
app.use(configDotenv());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: "gmail", 
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Parking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = sendEmail;
