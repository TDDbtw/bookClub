const express = require("express")
const router = express.Router()
const {
  getLogin,
  getSignup,
  getForgotPassword,
  forgotPassword,
  createUser,
  register,
  userLogin,
  logoutUser,
  loadOtp,
  tempSave,
  otpVerify,
  isEmailExist,
  resetPassword,
  getNewPassword,
  resetOtp,
  resetOtpVerify,
  saveResetPassword,
} = require("../controllers/auth")

const { protect, admin } = require("../middleware/authMiddleware")

router.route("/signup").get(getSignup).post(tempSave)
router.route("/signup/email").post(isEmailExist)

router.route("/save").get(createUser, getLogin)
router.route("/login").get(getLogin).post(userLogin)
router.route("/logout").post(logoutUser)
router.route("/password").get(getForgotPassword)
router.route("/password/email").post(resetPassword)
router.route("/password/new").get(getNewPassword)
router.route("/password/new/save").put(saveResetPassword)
router.route("/password/otp").post(resetOtp)
router.route("/password/otp/verify").post(resetOtpVerify)
router.route("/otp").get(loadOtp)
router.route("/otp/verify").post(otpVerify)

module.exports = router
