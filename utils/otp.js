// utils/otp.js
require("dotenv").config()
const speakeasy = require("speakeasy")
const nodemailer = require("nodemailer")

// Generate OTP
const generateOTP = () => {
  const secret = speakeasy.generateSecret({ length: 20 })
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  })
  return { secret: secret.base32, otp }
}

// Verify OTP
const verifyOTP = (secret, userOTP) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: userOTP,
  })
}

// Send OTP via email
const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PRO, // e.g., "gmail"
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welocme To QUASARX",
    text: `Your One time password for Email verification is : ${otp}`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}

module.exports = { generateOTP, verifyOTP, sendOTPEmail }
