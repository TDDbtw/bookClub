const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProduct,
  loadproducts,
  uploadImages,
  onetwo,
  getSortProducts,
  getSearchProducts,
  getFilterProducts,
  getSearchSortFilter,
  getProductsTwo,
} = require("../controllers/user/products")

const { protect, admin } = require("../middleware/authMiddleware")

// Display all products
// router.route("/").get(loadproducts)
router.route("/").get(loadproducts)
router.route("/list").get(onetwo)
router.route("/sort").get(getSortProducts)
router.route("/search").get(getSearchProducts)
router.route("/filter").get(getFilterProducts)
router.route("/:id").get(getProduct)
router.route("/one").post(onetwo)

module.exports = router
