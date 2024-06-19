const mongoose = require("mongoose")
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
  user: {
    type: ObjectID,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: ObjectID,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["cod", "razorpay"],
    required: true,
  },
  payment_details: {
    type: Object,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  shipping_address: {
    type: Object,
  },
  billing_address: {
    type: Object,
  },
  deliveryDate: {
    type: Date,
  },
})
orderSchema.pre("save", function (next) {
  const currentDate = new Date()

  if (!this.created_at) {
    this.created_at = currentDate
  }

  const deliveryDate = new Date(currentDate)
  deliveryDate.setDate(deliveryDate.getDate() + 5)

  // Set the deliveryDate field
  this.deliveryDate = deliveryDate

  next()
})

module.exports = mongoose.model("Order", orderSchema)
