const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/authMiddleware")
const {
  getUserOrder,
    getOrderSuccess,
  getCheckout,
  createOrder,
  testOrder,
} = require("../controllers/user/order")

router.route("/").get(protect, getUserOrder).post(createOrder)
router.route(`/success`).get(protect,getOrderSuccess)
router.route(`/test`).post(protect, createOrder)
module.exports = router
