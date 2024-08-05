const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});


walletSchema.methods.addTransaction = function(type, amount, description) {
  this.transactions.push({ type, amount, description });
  if (type === 'credit') {
    this.balance += amount;
  } else if (type === 'debit') {
    this.balance -= amount;
  }
};

walletSchema.statics.findOrCreate = async function(userId) {
  let wallet = await this.findOne({ user: userId });
  if (!wallet) {
    wallet = new this({ user: userId, balance: 0, transactions: [] });
  }
  return wallet;
};

walletSchema.statics.addReferralBonus = async function(userId, amount, description) {
  const wallet = await this.findOne({ user: userId });
  if (wallet) {
    wallet.addTransaction('credit', amount, description);
    await wallet.save();
    return wallet;
  }
  return null;
};


module.exports = mongoose.model('Wallet', walletSchema);
