const mongoose = require("mongoose")
const ObjectID = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectID,
      required: true,
      ref: "User",
    },

    items: [
      {
        productId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        image: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },
        productPrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Add at least one item"],
          max: [10, "You can only add 10 items at a time"],
          default: 1,
        },
        price: {
          type: Number,
        },
        selected: {
          type: Boolean, // Add a selected field to mark whether the item is selected
          default: false, // Initialize as not selected
        },
      },
    ],

    billTotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Cart = mongoose.model("Cart", cartSchema)
cartSchema.pre('save', function(next) {
  this.billTotal = this.items.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );
  next();
});
module.exports = Cart
