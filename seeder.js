const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

dotenv.config()

// Load Model
const User = require("./models/users")
const Product = require("./models/products")
const Category = require("./models/category") // Corrected model name
const Review = require("./models/reviews")

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

// read json file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
)
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, `utf-8`)
)
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, `utf-8`)
)

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`)
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
// import products to Mongo
const importProducts = async (products) => {
  try {
    await Product.create(products)
    console.log("Products imported".green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// deleteData
const deleteProducts = async () => {
  try {
    await Product.deleteMany()
    console.log("Products Destroyed".red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// import categories to Mongo
/////////////////////////////////////

// const importCategories = async (categories) => {
//   try {
//     await Category.create(categories) // Corrected function name
//     console.log("Categories imported".green.inverse)
//     process.exit()
//   } catch (err) {
//     console.error(err)
//   }
// }

// // deleteData
// const deleteCategories = async () => {
//   try {
//     await Category.deleteMany()
//     console.log("Categories Destroyed".red.inverse)
//     process.exit()
//   } catch (err) {
//     console.error(err)
//   }
// }
/////////////////////////////////////

const importReviews = async (reviews) => {
  try {
    await Review.create(reviews) // Corrected function name
    console.log("Reviews imported".green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// deleteData
const deleteReviews = async () => {
  try {
    await Review.deleteMany()
    console.log("Reviews Destroyed".red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === "-iu") {
  importUsers(users)
}

if (process.argv[2] === "-du") {
  deleteUsers()
}

if (process.argv[2] === "-ip") {
  importProducts(products) // Corrected function call
}

if (process.argv[2] === "-dp") {
  deleteProducts()
}

// if (process.argv[2] === "-ic") {
//   importCategories(categories) // Corrected function call
// }

// if (process.argv[2] === "-dc") {
//   deleteCategories()
// }

if (process.argv[2] === "-ir") {
  importReviews(reviews) // Corrected function call
}

if (process.argv[2] === "-dr") {
  deleteReviews()
}
