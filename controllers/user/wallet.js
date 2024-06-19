const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Order = require("../../models/order")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate } = require("../../utils/date")
const jwt = require("jsonwebtoken")
const colors = require("colors")
const express = require("express")
const router = express.Router()

const getWallet = asyncHandler(async (req, res, next) => {
  // res.render(`./users/addWallet`)
  res.render(`./users/wallet`)
})


module.exports = {
  getWallet
} 
