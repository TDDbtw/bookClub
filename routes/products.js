const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProduct,
  loadproducts,
  uploadImages,
  onetwo,
} = require("../controllers/user/products")

const { protect, admin } = require("../middleware/authMiddleware")

// Display all products
// router.route("/").get(loadproducts)
router.route("/").get(loadproducts)
router.route("/list").get(onetwo)
router.route("/:id").get(getProduct)
router.route("/one").post(onetwo)

module.exports = router
