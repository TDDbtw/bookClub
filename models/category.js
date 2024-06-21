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
    // required: true,
  },
})

module.exports = mongoose.model("Category", CategorySchema)
