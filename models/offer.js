const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema({
  offerName: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Amount'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  maximumAmount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  product: {
    type: ObjectId,
    ref: 'Product',
  },
  category: {
    type: ObjectId,
    ref: 'Category',
  },
});

offerSchema.statics.findActiveOffers = function() {
  const now = new Date();
  return this.find({ 
    status: true, 
    startDate: { $lte: now },
    expiryDate: { $gt: now } 
  });
};

offerSchema.statics.findOffersByProduct = function(productId) {
  return this.find({ product: productId, status: true, expiryDate: { $gt: new Date() } });
};

offerSchema.statics.findOffersByCategory = function(categoryId) {
  return this.find({ category: categoryId, status: true, expiryDate: { $gt: new Date() } });
};

offerSchema.methods.isValid = function() {
  const now = new Date();
  return this.status && now >= this.startDate && now <= this.expiryDate;
};

offerSchema.methods.calculateDiscountedPrice = function(originalPrice) {
  let discountedPrice = originalPrice;
  if (this.discountType === 'Percentage') {
    const discountAmount = originalPrice * (this.discountValue / 100);
    discountedPrice = Math.max(originalPrice - discountAmount, 0);
  } else if (this.discountType === 'Amount') {
    discountedPrice = Math.max(originalPrice - this.discountValue, 0);
  }
  return Math.min(discountedPrice, this.maximumAmount);
};

offerSchema.methods.getOfferDetails = function() {
  return {
    id: this._id,
    name: this.offerName,
    discountType: this.discountType,
    discountValue: this.discountValue,
    maximumAmount: this.maximumAmount,
    startDate: this.startDate,
    expiryDate: this.expiryDate,
    status: this.status,
    product:this.product,
    category:this.category
  };
};

offerSchema.pre('save', function(next) {
  if (this.expiryDate <= this.startDate) {
    next(new Error('Expiry date must be after the start date'));
  } else {
    next();
  }
});

offerSchema.virtual('remainingTime').get(function() {
  const now = new Date();
  const timeDiff = this.expiryDate > now ? this.expiryDate - now : 0;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d ${hours}h ${minutes}m`;
});


offerSchema.methods.getOfferType = function() {
  if (this.product) {
    return 'Product';
  } else if (this.category) {
    return 'Category';
  } else {
    return 'General';
  }
};
module.exports = mongoose.model('Offer', offerSchema);

