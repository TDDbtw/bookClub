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
const {
addWishlistItemToCart
} = require("../controllers/user/wishlist")

router.route("/").get(protect, getCart)
router.route("/list").get(protect, getCartList)
router.route("/add").post(protect, addItemToCart).get(protect, getCart)
router.route("/add/:productId").post(protect, addWishlistItemToCart)
router.route("/remove/:productId").delete(protect, removeItemFromCart)
router.route("/update/:productId").put(protect, updateCartItemQuantity)

module.exports = router
