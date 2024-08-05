const express = require("express");
const { upload, catImg } = require("../utils/multerUpload");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Import controllers
const adminController = require("../controllers/admin/admin");
const productController = require("../controllers/admin/products");
const categoryController = require("../controllers/admin/category");
const couponController = require("../controllers/admin/coupons");
const offerController = require("../controllers/admin/offer");
const orderController = require("../controllers/admin/order");
const userProductController = require("../controllers/user/products");
const { getAllAdminData,getRecentOrders,getSalesDatas, getBestSellingData} = require("../controllers/admin/adminData")
// Admin routes
router.get("/", protect, admin, adminController.getAdmin);
router.get("/all", protect, admin, getAllAdminData);
router.get('/orderItems', getRecentOrders);
router.get('/sales-data', getSalesDatas);
router.get('/best-selling', getBestSellingData)
router.get("/data", protect, admin, adminController.getAdminData);

// User management routes
router.get("/users", protect, admin, adminController.loadUsers);
router.get("/users/search", adminController.getSearchUsers);
router.route("/users/register").get(protect, admin, adminController.getCreateUser).post(protect, admin, adminController.createUsers);
router.get("/users/:id", protect, admin, adminController.getUser);
router.route("/users/:id/edit").get(adminController.getEditUsers).put(adminController.updateUsers);
router.delete("/users/:id/delete", protect, admin, adminController.deleteUsers);

// Product routes
router.get("/products", protect, admin, productController.loadProductList);
router.get("/products/search", productController.getSearchProducts);
router.route("/products/create").get(protect, admin, productController.loadCreateProduct).post(protect, admin, upload.array("image"), productController.createProduct);
router.route("/products/:id/edit").get(protect, admin, productController.loadEditProduct).put(protect, admin, productController.updateProducts).patch(protect, admin, upload.array("image"), productController.updateProducts);
router.delete("/products/:id/delete", protect, admin, productController.deleteProducts);
router.route("/products/:id/upload").get(userProductController.loadupload).post(userProductController.uploadImages);
router.delete("/products/image/:imageIndex", protect, admin, productController.updateImage);
router.post("/products/:id/remove-image", protect, admin, productController.removeImg);

// Category routes
router.get("/categories/:id/edit", protect, admin, categoryController.getCategoryEdit);
router.patch("/categories/:id/edit", protect, admin, catImg.single("image"), categoryController.createSubCategory);
router.delete("/categories/delete", protect, admin, categoryController.deleteSubCategory);
router.delete("/categories/:id/delete", protect, admin, categoryController.deleteCategoryById);
router.get("/category", protect, admin, categoryController.getCategoryList);
router.get("/category/search", protect, admin, categoryController.getSearchCategory);
router.get("/category/:id/edit/search", protect, admin, categoryController.getSearchSubCategory);
router.route("/category/create").get(protect, admin, categoryController.getCreateCategory).post(protect, admin, catImg.single("image"), categoryController.createCategory);
router.patch("/category/:id/edit", protect, admin, catImg.single("image"), categoryController.updateCategoryById);
router.delete("/category/:id/delete", protect, admin, categoryController.updateCategoryById);
router.patch("/category/:id/status", protect, admin, categoryController.changeStatus);

// Order routes
router.get("/orders", protect, admin, orderController.getAdminOrderList);
router.route("/orders/:id").get(protect, admin, orderController.getOrderById).put(protect, admin, orderController.updateOrderById);
router.patch('/order/:orderId/:productId/return', protect, admin, orderController.manageProductReturn);
router.patch('/order/:orderId/return', protect, admin, orderController.manageOrderReturn);

// Sales report routes
router.get("/sales-report", protect, admin, orderController.renderSalesReport);
router.get("/sales-report/list", protect, admin, orderController.getSalesReport);
router.get("/sales-report/download/excel", protect, admin, orderController.downloadExcel);
router.get("/sales-report/download/pdf", protect, admin, orderController.downloadPdf);

// Coupon routes
router.get("/coupons", protect, admin, couponController.renderCouponList);
router.route("/coupons/create").get(protect, admin, couponController.getAddCoupon).post(protect, admin, couponController.createCoupon);
router.route("/coupons/:id/edit").get(protect, admin, couponController.renderCouponEdit).patch(protect, admin, couponController.updateCoupon);
router.get("/coupons/list", protect, admin, couponController.getCouponList);

// Offer routes
router.get("/offers", protect, admin, offerController.renderOfferList);
router.route("/offers/create").get(protect, admin, offerController.renderCreateOffer).post(protect, admin, offerController.createOffer);
router.get("/offers/list", protect, admin, offerController.getOfferList);
router.route("/offers/:id/edit").get(protect, admin, offerController.renderEditOffer).patch(protect, admin, offerController.updateOffer);


router.get("/transactions", protect, admin, orderController.renderTransactionsList);
module.exports = router;
