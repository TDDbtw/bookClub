const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/authMiddleware")
const {
  getCheckout,
  getCart,
  addItemToCart,
  getCartDetails,
  removeItemFromCart,
  updateCartItemQuantity,
  getCartList,
} = require("../controllers/user/cart")

router.route("/").get(protect, getCart)
router.route("/list").get(protect, getCartList)
router.route("/add").post(protect, addItemToCart).get(protect, getCart)
// router.route("/remove/:id").delete(protect, removeItemFromCart)
router.route("/remove/:productId").delete(protect, removeItemFromCart)
// .get(protect, getCart)
// router.route("/update/:id").post(protect, updateCartItemQuantity)
router.route("/update/:productId").put(protect, updateCartItemQuantity)

module.exports = router
