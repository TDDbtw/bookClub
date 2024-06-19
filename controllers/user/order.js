const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const User = require("../../models/users")
const Cart = require("../../models/cart")
const Product = require("../../models/products")
const Order = require("../../models/order")
const express = require("express")
const Subcategories = require("../../models/subcategory")
const crypto = require("crypto")
const { formatDate } = require("../../utils/date")
const router = express.Router()
//get order
const getUserOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const cart = await Cart.findOne({ user: user.id })
    const orders = await Order.find({ user: user.id })
      .populate("items.productId", "name")
      .populate("user")
      .exec()

    // Concatenate all items from different orders into a single array
    const products = orders.flatMap((order) =>
      order.items.filter((item) => item.name)
    )

    // console.log(orders[0].items.quantity)
    // Render the view with orders and products

    // console.log(orders)
    res.render("./users/ordersList", { user, orders, products })
  } catch (error) {
    // Handle errors appropriately
    next(error)
  }
}

const getCheckout = asyncHandler(async (req, res, next) => {
  // console.log(req.user)
  res.render(`./users/order`)
})

const getOrderSuccess = asyncHandler (async (req,res,next )=>{
    res.render(`./users/orderSuccess`)
}
)
getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user").exec()
  const user = await User.findById(order.user._id)
  createdDate = formatDate(order.created_at)
  // console.log(req.user)
  res.render(`./users/order`, { order, user, createdDate })
})

const createOrder = asyncHandler(async (req, res, next) => {
  try {
    let userData = JSON.parse(req.body.user)
    const user = await User.findById(userData._id)

    let shippingTotal = ""
    switch (user.shipping_address.country) {
      case "United States":
        shippingTotal = 0
        break
      case "Canada":
        shippingTotal = 25
        break
      case "Mexico":
        shippingTotal = 40
        break
      case "India":
        shippingTotal = 90
        break
      default:
        break
    }

    let cart = await Cart.findOne({ user: user._id }).populate(
      "items.productId"
    )

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    let totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productPrice * item.quantity,

      0
    )
    totalAmount = (
      parseFloat(totalAmount) +
      shippingTotal +
      parseFloat(totalAmount) * 0.05
    )
    totalAmount=Number(totalAmount).toFixed(2)
    const orderData = {
      user: cart.user,
      totalAmount: totalAmount,
      payment_method: req.body.payment_method,
      shipping_address: user.shipping_address,
      billing_address: user.billing_address,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        name: item.name,
        price: item.productPrice,
        quantity: item.quantity,
        image: item.image,
      })),
    }
    let reduceQuantity = cart.items.map((item) => {
      return item.productId
    })
    console.log(reduceQuantity)
    req.totalAmount = totalAmount
    // console.log(orderData)
    const order = new Order(orderData)
    await order.save()
    console.log("Successfully created Order")

    cart.items = []
    cart.billTotal = 0
    await cart.save()

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

//
// Get all orders of a user
const getOrders = asyncHandler(async (req, res, next) => {
  const user = req.user

  const orders = await Order.find({ user: user._id })

  res.status(200).json({
    status: "success",
    data: orders,
  })

  res.status(500).json({
    status: "failed",
    message: error.message,
  })
})

// Get a single order by id
exports.OrderById = async (req, res) => {
  const user = req.user
  const orderId = req.params.id

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      })
    }

    if (order.user != user._id) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized access",
      })
    }

    res.status(200).json({
      status: "success",
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const user = req.user
  const orderId = req.params.id
  const { status } = req.body

  if (
    !Object.values([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]).includes(status)
  ) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid status value",
    })
  }

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      })
    }

    if (order.user != user._id) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized access",
      })
    }

    order.status = status
    await order.save()

    res.status(200).json({
      status: "success",
      message: "Order status updated",
    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    })
  }
}
const testOrder = asyncHandler(async (req, res, next) => {
  // const orders = await Order.find()
  console.log(req.body)

  res.json(req.body)
})
module.exports = {
  getCheckout,
    getOrderSuccess,
  getUserOrder,
  createOrder,
  getOrders,
  testOrder,
}
