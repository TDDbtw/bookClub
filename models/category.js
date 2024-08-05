const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: [true,"category with this name already exist"],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
  },
  status: {
    type: Boolean,
    default: true,
    required: false,
  },

})

module.exports = mongoose.model("Category", CategorySchema)
