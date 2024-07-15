const mongoose = require("mongoose")
const ObjectID = mongoose.Schema.Types.ObjectId
const moment = require("moment")
const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
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
      request: {
        type: {
          type: String,
          enum: ['cancel', 'return'],
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        reason: String,
             } ,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["cod", "razorpay",'wallet'],
    required: true,
  },
  payment_details: {
    type: Object,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled","returned"],
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
 returnRequest: {
    status: { 
      type: String,
      enum: ['pending', 'accepted'], 
      default: null 
    },
    reason: String, 
   requestDate: {
      type: Date,
    }
  }
})
function generateShortOrderId() {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

orderSchema.pre("save", function (next) {
  if (!this.created_at) {
    this.created_at = moment().toDate();
  }

  if (!this._id) {
    this._id = generateShortOrderId();
  }

  const deliveryDate = moment(this.created_at).add(5, 'days').toDate();
  this.deliveryDate = deliveryDate;

  next();
});

orderSchema.methods.calculateTotalAmount = function() {
  return this.totalAmount;
};

orderSchema.methods.isReturnable = function() {
  const returnPeriod = 7; // 7 days return policy
  return this.status === 'delivered' && 
         moment().diff(this.deliveryDate, 'days') <= returnPeriod;
};

orderSchema.methods.getOrderSummary = function() {
  return {
    orderId: this._id,
    totalAmount: this.totalAmount,
    status: this.status,
    itemCount: this.items.length,
    createdAt: this.created_at,
    deliveryDate: this.deliveryDate
  };
};


orderSchema.methods.calculateRefundAmount = function() {
  let refundableAmount = 0;

  this.items.forEach(item => {
    if (item.request.status !== 'accepted' || item.request.type !== 'return') {
      refundableAmount += item.price * item.quantity;
    }
  });

  return refundableAmount;
};
// orderSchema.pre("save", function (next) {
  //   const currentDate = new Date()

  //   if (!this.created_at) {
    //     this.created_at = currentDate
    //   }

  //   const deliveryDate = new Date(currentDate)
  //   deliveryDate.setDate(deliveryDate.getDate() + 5)

  //   // Set the deliveryDate field
  //   this.deliveryDate = deliveryDate

  //   next()
  // })

module.exports = mongoose.model("Order", orderSchema)
