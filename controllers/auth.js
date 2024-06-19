const express = require("express")
const router = express.Router()
const Users = require("../models/users")
const ErrorResponse = require("../utils/errorResponse")
const otp = require("../utils/otp")
const jwt = require("jsonwebtoken")
// const products = require(`../models/products`)
const bcrypt = require("bcryptjs")
const asyncHandler = require("../middleware/async")
const { generateOTP, sendOTPEmail, verifyOTP } = require("../utils/otpHandler")

// @desc    GET Register user
// @routes  get/auth/signup
// @access  public
const getSignup = asyncHandler(async (req, res, next) => {
  const errorMessage = req.query.error
  const auth = { auth: true }
  !req.cookies.jwt
    ? res.render("./auth/user/signUpForm", { errorMessage, auth })
    : res.redirect("/")

  // res.render("signup")
})
const getLogin = asyncHandler(async (req, res, next) => {
  // res.render("signUpForm")
  const errorMessage = req.query.error
  const auth = { auth: true }

  !req.cookies.jwt
    ? res.render("./auth/user/logInForm", { errorMessage, auth })
    : res.redirect("/")
})
const getForgotPassword = asyncHandler(async (req, res, next) => {
  // res.render("signUpForm")
  const errorMessage = req.query.error
  res.render("./auth/user/forgotPassword", { errorMessage })
})

const getNewPassword = asyncHandler(async (req, res, next) => {
  res.render("./auth/user/newPassword")
})

const loadOtp = asyncHandler(async (req, res, next) => {
  res.render("./auth/user/otpVerification")
})

const loadForgot = asyncHandler(async (req, res, next) => {
  // res.render("signUpForm")
  res.render("signup")
})

// @desc    POST Register user
// @routes  post//
// @access  public

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await Users.create({
    name,
    email,
    password,
  })
  res.status(200).json({ data: user }).redirect("/auth/login")
})

// check if email exists

const isEmailExist = asyncHandler(async (req, res, next) => {
  const { email } = req.body
  console.log(JSON.stringify(email))
  const existingUser = await Users.findOne({ email })
  console.log(existingUser)
  req.session.user = existingUser
  if (!existingUser) res.json({ success: true })
  else return next(new ErrorResponse("Email already exists", 401))
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body
  const existingUser = await Users.findOne({ email })
  // console.log(existingUser)
  req.session.email = req.body.email
  if (existingUser) res.json({ success: true, message: "true" })
  else return next(new ErrorResponse("Email  doesnt exist", 401))
})

const resetOtp = asyncHandler(async (req, res, next) => {
  req.session.userData = req.body
  console.log(`reset otp ${req.session.email}`)
  console.log(req.body.email)
  const email = req.session.email
  const existingUser = await Users.findOne({ email })
  const name = existingUser.name
  const { otp } = generateOTP()
  const userEmail = email

  sendOTPEmail(userEmail, otp, name)
  tempData = req.session.userData
  res.json({ success: true })
  // console.log(req.session.userData)
  // console.log(tempData)
})
const resetOtpVerify = asyncHandler(async (req, res, next) => {
  const userOtp = req.body.otp
  console.log(req.session.email)
  console.log(userOtp)
  if (verifyOTP(userOtp)) {
    res.json({ success: true, message: "OTP verification successful!" })
    // res.redirect("/auth/login")
  } else {
    res
      .status(400)
      .json({ success: false, message: "OTP verification failed." })
  }
})
// @desc    POST Login user
// @routes  post/auth/login
// @access  public
let tempData = 2
const tempSave = asyncHandler(async (req, res, next) => {
  req.session.userData = req.body
  console.log(` ${req.body}`)
  const email = req.body.email
  const name = req.body.name
  const { otp } = generateOTP()
  const userEmail = email

  sendOTPEmail(userEmail, otp, name)
  tempData = req.session.userData
  console.log(req.session.userData)
  console.log(tempData)
  res.redirect("/auth/otp")
})

const createUser = asyncHandler(async (req, res, next) => {
  console.log(`one create user ${req.body}`)
  const users = await Users.create(req.session.userData)
  res.redirect("/auth/login")
})

const saveResetPassword = asyncHandler(async (req, res, next) => {
  const email = req.session.email
  console.log(req.session.email)
  const users = await Users.findOne({ email })
  console.log(users)
  if (!users) return next(new ErrorResponse("User is not found", 401))
  const newPassword = req.body.password
  users.password = newPassword
  console.log(users.password)
  await users.save()
  res.json({ success: true })
})

const otpVerify = asyncHandler(async (req, res, next) => {
  const userOtp = await req.body.otp
  if (verifyOTP(userOtp)) {
    // Send a success response
    res.json({ success: true, message: "OTP verification successful!" })
    const users = await Users.create(req.body)
    res.redirect("/auth/login")
  } else {
    // Send a failure response
    res
      .status(400)
      .json({ success: false, message: "OTP verification failed." })
  }
})

const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findOne({ email })
  req.session.user = user
  console.log(await  user.matchPassword(password))
  if (user && (await user.matchPassword(password))) {
    // console.log(user)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET,
      {
        expiresIn: process.env.JWTEXPIRE,
      }
    )

    // Log the decoded token
    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // console.log("Decoded Token:", decodedToken) //set jwt as http only cookie
    res.cookie("jwt", token, {
      httponly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    if (user.role == "user") {
      res.json({ success: true, role: "user" })
    } else if (user.role == "admin") {
      res.json({ success: true, role: "admin" })
    }
  } else {
    console.log(user.role)
    return next(new ErrorResponse("Invalid Email or Password", 401))
  }
  if (user.status == false) {
    return next(new ErrorResponse("This email id has been blocked", 401))
  }
})

const forgotPassword = asyncHandler(async (req, res, next) => {})

// @desc    POST Logout user
// @routes  post/auth/logout
// @access  private

const logoutUser = asyncHandler(async (req, res, next) => {
  console.log(res.cookie)
  console.log(`sess bfr ${req.session}`)
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private, max-age=0"
  )
  req.session.destroy()
  console.log(`session aftr ${req.session}`)
  res.cookie("jwt", "", {
    httponly: true,
    express: new Date(0),
  })

  res.status(200).send({
    success: true,
    message: "User logged out",
  })
})

// const logoutUser = asyncHandler(async (req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, private, max-age=0"
//   )
//   res.cookie("jwt", "", {
//     httponly: true,
//     express: new Date(0),
//   })
//   res.redirect("/")
// })

module.exports = {
  // verifySignup,
  getSignup,
  getLogin,
  getForgotPassword,
  forgotPassword,
  resetPassword,
  loadOtp,
  tempSave,
  otpVerify,
  userLogin,
  register,
  logoutUser,
  createUser,
  isEmailExist,
  getNewPassword,
  resetOtp,
  resetOtpVerify,
  saveResetPassword,
}
