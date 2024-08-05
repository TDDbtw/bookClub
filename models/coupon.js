const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: [true, "Coupon code already exists"]
  },
  discount: {
    type: Number,
    required: [true, "You need to add the discount amount"],
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

// Check if the coupon is valid for the given user and order amount
couponSchema.methods.isValid = function(userId, orderAmount) {
  const now = new Date();
  return (
    this.status &&
    now <= this.expiry &&
    this.limit > 0 &&
    orderAmount >= this.minAmt &&
    orderAmount <= this.maxAmt &&
    !this.claimedBy.includes(userId)
  );
};


couponSchema.methods.applyDiscount = function(amount) {
  const discountAmount = (amount * this.discount) / 100;

  let discountedAmount = amount - discountAmount;
  if (discountedAmount < 0) discountedAmount = 0;

  return {
    discountedAmount,
    discountApplied: discountAmount
  };
};


// Update the coupon after it has been used
couponSchema.methods.use = function(userId) {
  this.claimedBy.push(userId);
  this.limit -= 1;
  return this.save();
};

module.exports = mongoose.model('Coupon', couponSchema);





