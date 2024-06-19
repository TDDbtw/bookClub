const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for the reviewer
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model for the reviewed product
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Review must have a rating"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  comment: {
    type: String,
    required: [true, "Review must have a comment"],
    minlength: [10, "Comment must be at least 10 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Review", ReviewSchema)
