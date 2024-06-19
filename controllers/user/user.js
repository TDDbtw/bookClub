const User = require("../../models/users")
const Products = require("../../models/products")
const Cart = require("../../models/cart")
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
      .populate("category")
      .populate("subcategories")
      .exec()
  res.render(`./admin/panel`, { users, products })
})

//  @desc     Get all users
//  @routes get/users
//  @access public

const loadUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
  res.render(`./admin/userList`, { users })
})

const getEditUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id })
  res.render(`./admin/userEdit`, { user })
})
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
  const userTest = await User.findById({ email: req.session.email })
  // const userTest = await User.findById(req.params.id)

  if (req.query.status) {
    updatedUserData.status = req.query.status
  }

  console.log(`Checking status ${JSON.stringify(updatedUserData)}`)

  // Update user by ID with the data from the request body
  console.log(req.session.email)
  console.log(`user test -->${userTest}`)

  const user = await User.findByIdAndUpdate(userTest, updatedUserData, {
    new: true, // Return the updated user data
    runValidators: true, // Run validation checks on the updated data
  })
  console.log(userTest.id)
  // console.log(user)
  console.log(`recieved status  = ${JSON.stringify(updatedUserData)}`)

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

  await user.save()
  // console.log(user)
  console.log(`Updated status: ${user.status}`)
  console.log("in user edit")

  res.json(user.status)

  // res.redirect("/admin/users")
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

const total = asyncHandler(async (req, res, next) => {
  user = req.body
  console.log(user)
  res.json(user)
})


// Update profile
const updateProfile = asyncHandler(async (req, res) => {
console.log(`${JSON.stringify(req.body.form)}`)
   const userId = req.user._id;
  const { name, email, password } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (password) {
    user.password = password;
  }
  if (req.file) {
    
    user.avatar = req.file.path.substring(6);
  }

  await user.save();
  res.json({ success: true, user });
});

module.exports = {
  loadUsers,
  createUsers,
  deleteUsers,
  updateUsers,
  getUser,
  getUsers,
  getEditInfo,
  getEditUsers,
  getAdmin,
  getCreateUser,
  getProfile,
  updateProfile,
  total,
}
