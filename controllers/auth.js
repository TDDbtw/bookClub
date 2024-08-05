const express = require("express")
const router = express.Router()
const Users = require("../models/users")
const Wallet = require("../models/wallet")
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
  const { email , referralCode} = req.body
  console.log(JSON.stringify(email))
  const existingUser = await Users.findOne({ email })
  if(referralCode.length!=0){
    if(referralCode.length!=6) return next(new ErrorResponse("invalid referral code", 401))
    else{
      const referrer = await Users.findOne({ referralCode: referralCode });
      if(!referrer) return next(new ErrorResponse("Refferal code does not Exist", 401))
      console.log(referrer)
    }

  }
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
  const email = req.session.email
  const existingUser = await Users.findOne({ email })
  if(!existingUser) return next(new ErrorResponse("Email  doesnt exist", 401))
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
  const{ email,name}= req.body
  const { otp } = generateOTP()
  const userEmail = email

  sendOTPEmail(userEmail, otp, name)
  tempData = req.session.userData
  res.redirect("/auth/otp")
})

const createUser = asyncHandler(async (req, res, next) => {
  console.log(`one create user ${req.body}`.red)
  const { referralCode, ...others } = req.session.userData;
  const newUser = new Users(others)
  const user =  await newUser.save()
  if(referralCode.length!=0){
    const refferer=await Users.findOne({referralCode:referralCode})
    refferer.userReferred.push(user._id)
    user.referredBy=refferer._id
    const wallet = await Wallet.findOrCreate(refferer._id);
    const userWallet = await Wallet.findOrCreate(user._id);
    wallet.addTransaction('credit', 5, `referrer Bonus`);
    userWallet.addTransaction('credit', 5, `login Bonus`);
    refferer.save()
    await userWallet.save()
    await wallet.save()

  }

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
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await Users.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse("email or password do not match", 401));
  }

  if (user.status === false) {
    return next(new ErrorResponse("This account has been blocked", 403));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET,
    { expiresIn: process.env.JWTEXPIRE }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password from output
  user.password = undefined;

  // Send response
  res.status(200).json({
    success: true,
    role: user.role,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});




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
    message: "User logged out"
  })
})

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
