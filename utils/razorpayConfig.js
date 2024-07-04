const Razorpay = require('razorpay')
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_CLIENT_SECRET,
    key_secret: process.env.RAZORPAY_CLIENT_ID
})


module.exports = razorpayInstance;
