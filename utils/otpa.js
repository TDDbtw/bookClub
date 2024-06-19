// utils/otp.js
const speakeasy = require("speakeasy")

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

module.exports = { generateOTP, verifyOTP }
