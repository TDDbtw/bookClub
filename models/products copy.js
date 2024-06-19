const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [50, "Product name cannot be longer than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [10, "Product description must be at least 10 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price cannot be negative"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product must belong to a category"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  modularity: {
    type: String,
    enum: ["Fully Modular", "Semi-Modular", "Non-Modular"],
    default: "Non-Modular",
  },
  wattage: {
    type: Number,
    required: [true, "Product wattage is required"],
    min: [0, "Product wattage cannot be negative"],
  },
})

module.exports = mongoose.model("Product", ProductSchema)
