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
//get order

const getAdminOrderList = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user").exec()
console.log(`${orders}`)
  // res.render(`./users/order`)
  // const user = await User.findById(req.user.id)
  // const cart = await Cart.findOne({ user: user.id })
  // const Orders = await Order.find({ user: user.id })
  // const order = await Order.findOne({ user: user.id })
  // const address = user.addresses[0]
  // const product = cart.items
  // console.log(product)
  // res.render(`./users/order`, { user, cart, order })
  // console.log(Orders)
  res.render(`./admin/orderList`, { orders })
  // res.json("./admin")
  // res.send(order)
})
const getCheckout = asyncHandler(async (req, res, next) => {
  res.render(`./users/order`)
})
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  const user = await User.findById(order.user._id)
  console.log(order)
  createdDate = formatDate(order.created_at)

  res.render(`./admin/orderEdit`, { order, user, createdDate })
})

//
// Create Order
//
const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { totalAmount, payment_method } = req.body
    const user = await User.findById(req.user.id)
    console.log(user)
    const cart = await Cart.findOne({ user: user.id })
    console.log(cart)

    if (!user || !cart) {
      return next(new ErrorResponse("User or cart not found", 404))
    }

    // const order = new Order({
    //   user: req.user.id,
    //   items: cart.items,
    //   totalAmount: totalAmount,
    //   payment_method: payment_method,
    //   // Ensure that this structure matches your Order schema
    //   // Other properties from req.body
    // })
    console.log(`this is order -->${cart}`)
    // Order.find().populate("categories").populate("subcategories").exec()

    // await order.save()

    // res.status(201).send(cart)
    res.redirect("/order")
  } catch (error) {
    // Handle other potential errors
    console.error(error)
    next(new ErrorResponse("Internal Server Error", 500))
  }
})

//
// Get All Orders
//
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).send(orders)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Get Single Order
//
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return next(new ErrorResponse(`Order Not Found`, 404))
    }
    res.status(200).send(order)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update Order
//
const updateOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!order) {
    return next(new ErrorResponse(`Order Not Found`, 404))
  }
  res.status(200).send(order)
})

// Delete Order
//
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
      return res.status(404).send("Order not found")
    }
    res.status(200).send(order)
  } catch (error) {
    res.status(500).send(error)
  }
})
const test = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
  const subcategories = await Subcategories.find()

  res.json({ subcategories })
})
module.exports = {
  getCheckout,
  getAdminOrderList,
  createOrder,
  test,
  getOrderById,
  updateOrderById,
}
