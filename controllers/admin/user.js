const User = require("../../models/users")
const Products = require("../../models/products")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")

const getCreateUser = asyncHandler(async (req, res, next) => {
  res.render(`./admin/createUser`)
})
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.render(`./users/profile`, { user })
})

const getEditInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.render(`./users/editInfo`, { user })
})

const getAdmin = asyncHandler(async (req, res, next) => {
  const users = await User.find()
  const products = await Products.find()
  res.render(`./admin/panel`, { users, products })
})

//  @desc     Get all users
//  @routes get/users
//  @access public

const loadUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
  const userCount = await User.countDocuments()
  const blockCount = await User.countDocuments({status:false})
  res.render(`./admin/userList`, {userCount,blockCount, users, name: "User List" })
})

const getEditUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id })
  res.render(`./admin/userEdit`, { user })
})
// const getUsers = asyncHandler(async (req, res, next) => {
//   const users = await User.find()

//   res.status(200).json({
//     success: true,
//     count: users.length,
//     data: users,
//   })
// })
const getUsers = asyncHandler(async (req, res, next) => {
  // let query
  // let queryString = JSON.stringify(req.query)
  // queryString = queryString.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // )
  // query = User.findOne(JSON.parse(queryString))
  // console.log(queryString)
  const users = await User.find()

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

//  @desc     get single user
//  @routes get/users/:id
//  @access private

const getUser = asyncHandler(async (req, res, next) => {
  const users = await User.findById(req.params.id)
  if (!users) {
    return next(
      new ErrorResponse(`User not found wih the id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: users,
  })
})

//  @desc     POST Create user
//  @routes post/users/
//  @access public

const createUsers = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const users = await User.create(req.body)
  res.redirect("/admin/users")
})

//  @desc     Update user
//  @routes PUT  /users/:id
//  @access private

const updateUsers = asyncHandler(async (req, res, next) => {
  const updatedUserData = req.body
  let userId = req.params.id
  // const userTest = await User.findById({ email: req.session.email })
  const userTest = await User.findById(req.params.id)

  if (req.query.status) {
    updatedUserData.status = !userTest.status
  }
  console.log("admin user running")
  // console.log(`Checking status ${JSON.stringify(updatedUserData)}`)

  // Update user by ID with the data from the request body
  // console.log(req.session.email)
  // console.log(`user test -->${userTest}`)

  const user = await User.findByIdAndUpdate(userTest, updatedUserData, {
    new: true, // Return the updated user data
    runValidators: true, // Run validation checks on the updated data
  })
  // console.log(userTest.id)
  // console.log(user)
  // console.log(`recieved status  = ${JSON.stringify(updatedUserData)}`)

  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.params.id}`, 404)
    )
  }
  if (req.query.status == true) {
    user.status = false
  } else if (req.query.status == false) {
    user.status = true
  }
  console.log(user.status)

  await user.save()
  // console.log(user)
  // console.log(`Updated status: ${user.status}`)

  res.json(user.status)

  // res.redirect("/admin/users")
})
const getSearchUsers = asyncHandler(async (req, res, next) => {
  let query = {}
  // if (req.query.search) {
  // }
  const users = await User.find({
    name: { $regex: req.query.search, $options: "i" },
  })
  const responseData = {
    users: users,
  }
  res.json(responseData)
})
//  @desc     Delete one user
//  @routes delete /users/:id
//  @access

const deleteUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findByIdAndDelete(req.params.id)
  if (!users) {
    return next(
      new ErrorResponse(`User not found wih the id of ${req.params.id}`, 404)
    )
  }
  res.status(201).json({
    success: true,
    data: {},
  })
})

module.exports = {
  loadUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  getUser,
  getUsers,
  getEditInfo,
  getEditUsers,
  getAdmin,
  getCreateUser,
  getProfile,
  getSearchUsers,
}
