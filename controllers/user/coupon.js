
const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Order = require("../../models/order")
const Coupon = require("../../models/coupon")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate } = require("../../utils/date")
const jwt = require("jsonwebtoken")
const colors = require("colors")
const express = require("express")
const router = express.Router()


const renderUserCouponList = asyncHandler(async (req, res, next) => {
  res.render(`./admin/couponList`)
})

const applyCoupon = asyncHandler(async (req, res, next) => {
 let { couponCode, user, cart } = req.body;
// user=JSON.parse(user)
  user=await User.findById(req.body.user)
console.log(`user is ${user}`.red)
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    if (coupon.expiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (!coupon.status) {
      return res.status(400).json({ success: false, message: 'Coupon is not available' });
    }
    if (coupon.claimedBy.includes(user._id)) {
      return res.status(400).json({ success: false, message: 'you have  already claimed this coupon' });
    }

    if (coupon.limit <= 0) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

  let  userCart= await Cart.find({ user:req.body.user });

    if (!userCart || userCart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = userCart[0].items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
    totalAmount = parseFloat(totalAmount) + parseFloat(totalAmount) * 0.05;

    if (totalAmount < coupon.minAmt) {
      return res.status(400).json({ success: false, message: `Minimum order amount for this coupon is ${coupon.minAmt}` });
    }

    const discount = Math.min(coupon.discount, coupon.maxAmt);
    const newTotal = totalAmount - discount;

  
  if( discount && newTotal ){
    res.json({ success: true, discount, newTotal });
  }
  else{
    return next(new ErrorResponse("Cant apply this coupon now", 401))
  }
})

const applyCouponFun = async (couponCode, userId, totalAmount) => {
  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.expiry < Date.now()) {
    throw new Error("Coupon has expired");
  }

  if (coupon.claimedBy.includes(userId)) {
    throw new Error("Coupon already used by this user");
  }

  if (coupon.limit <= 0) {
    throw new Error("Coupon usage limit reached");
  }

  if (totalAmount < coupon.minAmt) {
    throw new Error(`Minimum order amount for this coupon is ${coupon.minAmt}`);
  }

  const discount = Math.min(coupon.discount, coupon.maxAmt);
  const newTotalAmount = totalAmount - discount;


  return {coupon,discount, newTotalAmount };
};
module.exports = {
  applyCoupon,
renderUserCouponList,
applyCouponFun,
}
