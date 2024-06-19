const Category = require("../../models/category")
const ErrorResponse = require("../../utils/errorResponse")
const asyncHandler = require("../../middleware/async")

// @desc     Get all categories
// @route    GET /categories
// @access   public
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  })
})

// @desc     Get single category
// @route    GET /categories/:id
// @access   public
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: category,
  })
})

// @desc     Create category
// @route    POST /categories
// @access   private
const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body)

  res.status(201).json({
    success: true,
    data: category,
  })
})

// @desc     Update category
// @route    PUT /categories/:id
// @access   private
const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: category,
  })
})

// @desc     Delete category
// @route    DELETE /categories/:id
// @access   private
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id)

  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  getCategories,
}
