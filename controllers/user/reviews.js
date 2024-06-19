const Review = require("../../models/reviews")
const Product = require("../../models/products")
const asyncHandler = require("../../middleware/async")
const ErrorResponse = require("../../utils/errorResponse")

// @desc    Get all reviews
// @route   GET /reviews
// @route   GET /products/:productId/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({ product: req.params.productId })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc    Get single review
// @route   GET /reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "product",
    select: "name description",
  })

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @desc    Add review
// @route   POST /products/:productId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  req.body.product = req.params.productId

  const product = await Product.findById(req.params.productId)

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with id of ${req.params.productId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

// @desc    Update review
// @route   PUT /reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    )
  }

  // Ensure the user updating the review is the review user
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review`,
        401
      )
    )
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @desc    Delete review
// @route   DELETE /reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    )
  }

  // Ensure the user deleting the review is the review user
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review`,
        401
      )
    )
  }

  await review.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getReview,
  deleteReview,
  updateReview,
  addReview,
  getReviews,
}
