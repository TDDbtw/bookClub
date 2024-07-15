const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: [true,"Coupon code already exists"]
  },
  discount: {
    type: Number,
    required: [true,"You need to add the discount amount"],
  },
  limit: {
    type: Number,
    required: true,
  },

  expiry: {
    type: Date,
    required: true,
  },
  minAmt: {
    type: Number,
    required: true,
  },
  maxAmt: {
    type: Number,
    required: true,
  },

  claimedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Coupon', couponSchema);

