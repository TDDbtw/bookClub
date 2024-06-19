const mongoose = require("mongoose")
const slugify = require("slugify")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const AuthSchema = new mongoose.Schema({
  //

  name: {
    type: String,
    required: [true, "Please enter your Full Name"],
    index: {
      dropDups: true,
    },
  },

  email: {
    type: String,
    unique: [true, "email id already exists"],
    required: [true, "Please enter your Email"],
    match: [
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  role: {
    type: String,
    default: "user",
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
  resetpasswordtoken: String,
  resetpasswordexpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

AuthSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

AuthSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// JwT

AuthSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: process.env.JWTEXPIRE,
  })
}
const Auth = mongoose.model("Auth", AuthSchema)

// Export the model
module.exports = Auth
