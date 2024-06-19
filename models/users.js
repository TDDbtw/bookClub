const mongoose = require("mongoose")
const slugify = require("slugify")
const bcrypt = require("bcryptjs")
const UserSchema = new mongoose.Schema({
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
      "Email is not Valid ",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  addresses: [
    {
      address: {
        type: String,
        required: true,
      },
      apartment_suite_etc: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip_code: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "United States",
      },
    },
  ],
  billing_address: {
    type: Object,
    default: undefined,
  },
  shipping_address: {
    type: Object,
    default: undefined,
  },

  role: {
    type: String,
    default: "user",
    required: false,
  },
  avatar: {
    type: String,
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
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// JwT

const User = mongoose.model("User", UserSchema)

// Export the model
module.exports = User
