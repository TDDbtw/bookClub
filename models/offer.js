const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: Boolean, default: true },
  maxAmt: { type: Number, required: true },
  minAmt: { type: Number, required: true }
});

// Check if the offer is currently active
offerSchema.methods.isActive = function() {
  const now = new Date();
// console.log(`start date is${this.startDate}`.red)
// console.log(`end date is${this.endDate}`.blue)
// console.log(`now is${now}`.green)
  return now >= this.startDate && now <= this.endDate && this.status;
};

// Apply discount to a given price
offerSchema.methods.applyDiscount = function(price) {
  return price * (1 - this.discountPercentage / 100);
};

// Get the remaining time for the offer
offerSchema.methods.getRemainingTime = function() {
  const now = new Date();
  if (now > this.endDate) return 'Expired';
  if (now < this.startDate) return 'Not started';
  const remainingTime = this.endDate - now;
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days} days and ${hours} hours`;
};

// Static method to find all active offers
offerSchema.statics.findActiveOffers = function() {
  const now = new Date();
  return this.find({
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};

// Static method to find soon-to-expire offers
offerSchema.statics.findSoonToExpireOffers = function(days = 3) {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return this.find({
    endDate: { $gte: now, $lte: future }
  });
};

module.exports = mongoose.model('Offer', offerSchema);

