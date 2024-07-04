const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

dotenv.config()

// Load Model
const User = require("./models/users")

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

// read json file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
)
const importUsers = async (users) => {
  try {
    await User.create(users)
    console.log("Users imported".green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// deleteData
const deleteUsers = async () => {
  try {
    await User.deleteMany()
    console.log("Users Destroyed".red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}
/////////////////////////////////////

if (process.argv[2] === "-iu") {
  importUsers(users)
}

if (process.argv[2] === "-du") {
  deleteUsers()
}
