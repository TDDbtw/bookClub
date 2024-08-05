const mongoose = require("mongoose")

const connDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`MongoDB connected :${conn.connection.host}`.rainbow)
}
module.exports = connDB
