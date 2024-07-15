const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/authMiddleware")
const { getAccessToken } = require("../utils/paypalConfig")
const {
  getUserOrder,
  getOrderSuccess,
  getCheckout,
  createOrder,
  razorpayOrder,
  testOrder,
  cancelOrReturnOrder,
  cancelOrder,
  returnOrder,
  cancelProduct,
  returnProduct,
  loadInvoice,
} = require("../controllers/user/order")
const couponController = require("../controllers/user/coupon")
router.route("/").get(protect, getUserOrder).post(createOrder)
router.route('/wallet')
router.route("/razorpayOrder").post(protect, razorpayOrder)
router.route(`/success`).get(protect,getOrderSuccess)
router.route(`/test`).post(protect, createOrder)
router.route(`/test`).get(protect, getAccessToken)
router.post("/:id/change", protect, cancelOrReturnOrder);
router.route("/applyCoupon").post(couponController.applyCoupon)
router.route("/removeCoupon").post(couponController.removeCoupon)
// edit

router.put('/:orderId/cancel', cancelOrder);
router.put('/:orderId/return', returnOrder);
router.get('/:id/invoice', loadInvoice);
router.put('/:orderId/product/:productId/cancel', cancelProduct);
router.put('/:orderId/product/:productId/return', returnProduct);



module.exports = router
