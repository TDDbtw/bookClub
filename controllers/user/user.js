const User = require("../../models/users")
const Products = require("../../models/products")
const Wallet = require("../../models/wallet")
const Cart = require("../../models/cart")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.render(`./users/profile`, { user })
})

const getEditInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.render(`./users/editInfo`, { user })
})

const updateUsers = asyncHandler(async (req, res, next) => {
  const updatedUserData = req.body
  let userId = req.params.id
  const userTest = await User.findById({ email: req.session.email })
  // const userTest = await User.findById(req.params.id)

  if (req.query.status) {
    updatedUserData.status = req.query.status
  }

  console.log(`Checking status ${JSON.stringify(updatedUserData)}`)

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

})

const total = asyncHandler(async (req, res, next) => {
  user = req.body
  console.log(user)
  res.json(user)
})


// Update profile
const updateProfile = asyncHandler(async (req, res) => {
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  
  const userId = req.user._id;
  const { name, email, password } = req.body;

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate and update name
  if (name) {
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
    }
    user.name = name.trim();
  }

  // Validate and update email
  if (email && email !== user.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    user.email = email.toLowerCase();
  }

  // Update password if provided
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    user.password = password;
  }

  // Update avatar if file is provided
  if (req.file) {
    user.avatar = req.file.path.substring(6);
  }

  // Save the updated user
  await user.save();

  // Return the updated user without sensitive information
  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.json({ success: true, user: updatedUser });
});


// const updateProfile = asyncHandler(async (req, res) => {
// console.log(`${JSON.stringify(req.body.form)}`)
//    const userId = req.user._id;
//   const { name, email, password } = req.body;
//   const user = await User.findById(userId);

//   if (!user) {
//     res.status(404).json({ error: 'User not found' });
//     return;
//   }

//   user.name = name || user.name;
//   user.email = email || user.email;
//   if (password) {
//     user.password = password;
//   }
//   if (req.file) {
    
//     user.avatar = req.file.path.substring(6);
//   }

//   await user.save();
//   res.json({ success: true, user });
// });

module.exports = {
  updateUsers,
 getEditInfo,
  getProfile,
  updateProfile,
  total,
}
