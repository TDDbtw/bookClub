// utils/otp.js
require("dotenv").config()
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const session = require("express-session")
// Generate OTP

let genOTP = 2
const generateOTP = () => {
  const secret = crypto.randomBytes(1).toString("hex")
  const otp = crypto.randomBytes(3).toString("hex").toUpperCase()
  genOTP = otp
  return { secret, otp }
}

// Verify OTP
const verifyOTP = (userOTP) => {
  return userOTP == genOTP
}

// Send OTP via email
const sendOTPEmail = (email, otp, name) => {
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
    text: `hello ${name},\n Welcome to QUASARX Your One time password for Email verification is : ${otp}`,
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
