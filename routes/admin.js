const express = require("express")
const {
  upload,
catImg,} = require("../utils/multerUpload")
const productController = require("../controllers/admin/products")
const router = express.Router()

const {
  createUsers,
  deleteUsers,
  getUser,
  getUsers,
  getAdmin,
  getCreateUser,
} = require("../controllers/user/user")

// usersRoute.js
const { uploadImages, loadupload } = require("../controllers/user/products")
const {
  loadUsers,
  getEditUsers,
  updateUsers,
  getSearchUsers,
} = require("../controllers/admin/user")
const {
  updateProducts,
  loadCreateProduct,
  createProduct,
  loadEditProduct,
  loadProductList,
  deleteProducts,
  getSearchProducts,
  updateImage,
  test,
} = require("../controllers/admin/products")
//
const {
  getCategoryEdit,
  getCategoryList,
  getCreateCategory,
  deleteCategoryById,
  createSubCategory,
  deleteSubCategory,
  createCategory,
  updateCategoryById,
} = require("../controllers/admin/category")
const {
getCouponList,
  getAddCoupon
  
} = require("../controllers/admin/coupons")



const {
  getAdminOrderList,
  getOrderById,
  updateOrderById,
} = require("../controllers/admin/order")
//
const { protect, admin } = require("../middleware/authMiddleware")
const { validateProduct   } = require("../middleware/productValidation")
//
router.route("/").get(protect, admin, getAdmin)
router.route(`/users`).get(protect, admin, loadUsers)
router.route(`/users/search`).get(getSearchUsers)

router
  .route("/users/register")
  .get(protect, admin, getCreateUser)
  .post(protect, admin, createUsers)
router.route(`/users/:id`).get(protect, admin, getUser)
router.route(`/users/:id/edit`).get(getEditUsers).put(updateUsers)
router.route(`/users/:id/delete`).delete(deleteUsers)

// router.route(`/users/:id/edit/save`).get(loadUsers).put(updateUsers)

router
  .route(`/users/:id/edit/save`)
  .put(protect, admin, updateUsers)
  .get(protect, admin, loadUsers)

router.route(`users/:id/delete`).delete(protect, admin, deleteUsers)

// Display all products
router.route(`/products`).get(protect, admin, loadProductList)
router
  .route("/products/:id/edit")
  .get(protect, admin, loadEditProduct)
  .put(protect, admin, updateProducts)
  .patch(protect, admin, updateProducts)

router.route(`/products/search`).get(getSearchProducts)

router
  .route("/products/create")
  .get(protect, admin, loadCreateProduct)
  .post(protect, admin, upload.array("image"), createProduct)
router.route("/products/:id/delete").delete(protect, admin, deleteProducts)
router.route("/products/:id/upload").get(loadupload).post(uploadImages)
router.route("/products/image/:imageIndex").delete(protect, admin, updateImage)

//
router.route("/categories/:id/edit").get(protect, admin, getCategoryEdit)
router.route("/categories/:id/edit").patch(protect, admin, createSubCategory)
router.route("/categories/delete").delete(protect, admin, deleteSubCategory)
router
  .route("/categories/:id/delete")
  .delete(protect, admin, deleteCategoryById)

router.route("/category").get(protect, admin, getCategoryList)
router
  .route("/category/create")
  .get(protect, admin, getCreateCategory)
  .post(protect, admin,catImg.single("image"), createCategory)

  router.route("/category/:id/edit").patch(protect, admin,catImg.single("image"), updateCategoryById)
  router.route("/category/:id/delete").delete(protect,admin, updateCategoryById)
// Oreder route
// Get All Orders
router.route("/orders").get(protect, admin, getAdminOrderList)
router
  .route("/orders/:id")
  .get(protect, admin, getOrderById)
  .put(protect, admin, updateOrderById)

router.route("/coupons").get(protect,admin,getCouponList)

module.exports = router
