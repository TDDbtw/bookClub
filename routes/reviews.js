const express = require("express")
const router = express.Router()
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/user/reviews")

// Assuming you have a 'reviews' Pug template in your 'views' folder for rendering reviews

router.route("/").get(getReviews).post(addReview)
router.route("/:id").get(getReview).put(updateReview).delete(deleteReview)

module.exports = router
