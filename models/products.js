const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    // Basic Product Information
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name cannot be longer than 100 characters"],
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
    author: {
      type: String,
      required: true,
      trim: true,
    },
    image: [
      {
        type: String,
      },
    ],
    stockCount: {
      type: Number,
      required: true,
      min: 0,
    },
    offer: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer' 

    },

    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],

  },
  { timestamps: true } // Automatically manages createdAt and updatedAt timestamps
);

ProductSchema.virtual('discountedPrice').get(function() {
  if (this.offer && this.offer.isActive && this.offer.isActive()) {
    return this.offer.applyDiscount(this.price);
  }
  return this.price;
});



module.exports = mongoose.model("Product", ProductSchema);
