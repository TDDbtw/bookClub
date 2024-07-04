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
    type: String,
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

module.exports = mongoose.model('Offer', offerSchema);
