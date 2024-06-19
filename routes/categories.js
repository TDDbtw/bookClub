const express = require("express")
const router = express.Router()
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryEdit,
  getCategoryList,
} = require("../controllers/admin/category")

router.route("/").get(getCategoryList).post(createCategory)
router.route("/:id").get(getCategoryEdit)
router.route("/:id/edit").get(getCategoryEdit).put(updateCategoryById)
router.route("/:id/delete").delete(deleteCategoryById)

module.exports = router
