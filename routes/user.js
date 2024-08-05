const express = require("express")
const router = express.Router()
const {
  upload,
  catImg,
  uploadUser
} = require("../utils/multerUpload")

const {
  getProfile,
  getEditInfo,
  updateUsers,
  total,
  updateProfile,
} = require("../controllers/user/user")
const {
  getAddAddress,
  getEditAddress,
  postAddAddress,
  patchEditAddress,
  deleteAddress,
  test,
} = require("../controllers/user/address")
const {getWallet,handlePayPalPayment,createPayPalOrder} = require("../controllers/user/wallet")
const { getCheckout } = require("../controllers/user/cart")
const { getWishlist,getUserWishlist,addToWishlist,removeFromWishlist  } = require("../controllers/user/wishlist")
const { getUserOrder, createOrder,getOrderById} = require("../controllers/user/order")
const { protect, admin } = require("../middleware/authMiddleware")



router.route("/profile").get(protect, getProfile)
router.post("/profile").get(protect, getProfile)
router.route("/profile/edit").get(protect, getEditInfo)
router.route("/profile/update").get(protect, getEditInfo).patch(protect, uploadUser.single('croppedImage'),updateProfile)
router
  .route(`/profile/:id/edit/save`)
  .put(protect, updateUsers)
  .get(protect, admin, getEditInfo)

router
  .route("/address/:id/edit")
  .get(protect, getEditAddress)
  .patch(patchEditAddress)

router
  .route("/address/new")
  .get(protect, getAddAddress)
  .post(protect, postAddAddress)
router.route("/address/:id/remove").delete(protect, deleteAddress)
// .get(protect, getProfile)
router.route("/checkout").get(protect, getCheckout).post(protect, createOrder)
router.route("/").post(total)
router.route("/set").get(test)
// wishlist 

router.route("/wishlist").get(protect, getWishlist)
router.route("/wishlist/list").get(protect, getUserWishlist)
router.route("/wishlist/remove/:productId").delete(protect,removeFromWishlist )
router.route("/wishlist/add/:productId").post(protect, addToWishlist)


/// Order

router.route("/order").get(protect, getUserOrder)
router.route("/order/:id").get(protect, getOrderById)

router.route("/wallet").get(protect,getWallet)
router.route("/wallet/paypal/create-order").post(protect,createPayPalOrder)
router.route("/wallet/paypal/capture-order").post(protect,handlePayPalPayment)
module.exports = router
