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

const renderCouponList = asyncHandler(async (req, res, next) => {
const coupons = await Coupon.find()
console.log(`${Array.isArray(coupons)}`.red )
  res.render(`./admin/couponList` ,{coupons:coupons})
})


const renderCouponEdit = asyncHandler(async (req, res, next) => {
  const couponId = req.params.id;
  console.log(`${couponId}`.yellow);

  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      // Handle case where coupon is not found
      return res.status(404).send('Coupon not found');
    }
    console.log(`${coupon}`.red);
    res.render('./admin/couponEdit', { coupon ,formatDate});
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send('Server Error');
  }
});



const getAddCoupon = asyncHandler(async (req, res, next) => {
  res.render(`./admin/createCoupon`)
})

const createCoupon = asyncHandler(async (req, res, next) => {

  let {discount,limit,expiry,minAmt,maxAmt} = req.body;
  const code = req.body.code.replace(/\s/g,"");
  if (!code || !discount || !expiry ) {
    return res.status(206).json({ success: false, error: "Required fields missing" });
  }
  const existingCoupon = await Coupon.findOne({
    code: { $regex: new RegExp("^" + code, "i") },
  });
  console.log(`${existingCoupon}`) 


  const newCoupon = new Coupon({
    code: code,
    discount: discount,
    limit: limit,
    expiry: expiry,
    maxAmt: maxAmt,
    minAmt: minAmt,
  });
  await newCoupon.save();
  res.status(200).json({ success: true, message: "Coupon added successfully" });

  // res.json({"code":code,"exist":existingCoupon,"newCoupon":newCoupon} )
})



const updateCoupon = asyncHandler(async (req, res, next) => {

  if(req.query.change){
    const changeStatus = await Coupon.findById(req.params.id);
    changeStatus.status=!changeStatus.status
    await changeStatus.save()
    res.status(200).json({success:true ,message: 'Coupon status updated ' });
  }
  let {discount,limit,expiry,minAmt,maxAmt,status} = req.body;

  const code = req.body.code.trim()



    const existingCoupon = await Coupon.findById(req.params.id);
    if (!existingCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Update existingCoupon details
    existingCoupon.code = code || existingCoupon.code;
    existingCoupon.limit = limit || existingCoupon.limit;
    existingCoupon.expiry = expiry || existingCoupon.expiry;
    existingCoupon.discount = discount || existingCoupon.discount;
    existingCoupon.minAmt = minAmt || existingCoupon.minAmt;
    existingCoupon.maxAmt = maxAmt || existingCoupon.maxAmt;
    existingCoupon.status = status || existingCoupon.status;
    await existingCoupon.save();
    res.status(200).json({ message: 'Coupon updated successfully', existingCoupon });
})

const getCouponList = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.find().sort({ createdDate: -1 });
  res.json(coupon)
})
module.exports = {
  renderCouponList,
renderCouponEdit,
  getAddCoupon,
  createCoupon,
  updateCoupon,
getCouponList,
}


