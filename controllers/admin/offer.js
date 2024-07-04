
const Products = require("../../models/products")
const Offer = require("../../models/offer")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const jwt = require("jsonwebtoken")
const { formatDate } = require("../../utils/date")


const renderCreateOffer = asyncHandler(async (req, res, next) => {
  res.render(`./admin/createOffer` )
})

const renderEditOffer = asyncHandler(async (req, res, next) => {

  const offerId = req.params.id;
  console.log(`${offerId}`.yellow);

  try {
    const item = await Offer.findById(offerId);
    if (!item) {
      return res.status(404).send('Coupon not found');
    }
    console.log(`${item}`.red);
    res.render('./admin/offerEdit', { item ,formatDate});
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send('Server Error');
  }
})
const renderOfferList = asyncHandler(async (req, res, next) => {
  const offers = await Offer.find().sort({ offerName: -1 })
  res.render(`./admin/offerList`,{items:offers} )
})
const createOffer = asyncHandler(async (req, res, next) => {
  const { offerName, discountType, discountValue, maximumAmount, startDate, expiryDate } = req.body;
  const itemId = req.body.productId || req.body.catId;

  let item;
  let existingOffer;
  if (req.body.productId) {
    item = await Products.findById(itemId);
    existingOffer = await Offer.findOne({ product: itemId });
  if (existingOffer) {
    return next(new ErrorResponse('Offer for this Product already exists', 401));
  }
  } else if (req.body.catId) {
    item = await Categories.findById(itemId);
    existingOffer = await Offer.findOne({ category: itemId });
  if (existingOffer) {
    return next(new ErrorResponse('Offer for this Category already exists', 401));
  }
  }
  if (!item) {
    return res.status(404).json({ message: 'Product or Category not found' });
  }


  const newOffer = new Offer({
    offerName,
    discountType,
    discountValue,
    maximumAmount,
    startDate,
    expiryDate,
    product: req.body.productId || null,
    category: req.body.catId || null,
  });

  await newOffer.save();

  res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
});



const updateOffer = asyncHandler(async (req, res, next) => {

  if(req.query.change){
    const changeStatus = await Offer.findById(req.params.id);
    changeStatus.status=!changeStatus.status
    await changeStatus.save()
    res.status(200).json({success:true ,message: 'Offer status updated ' });
  }
  
  let {maximumAmount,discountType,discountValue,startDate,expiryDate,status,product,category} = req.body;

  const offerName = req.body.offerName.trim()



    const existingOffer = await Offer.findById(req.params.id);
    if (!existingOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    existingOffer.offerName = offerName || existingOffer.offerName;
    existingOffer.discountType = discountType || existingOffer.discountType;
    existingOffer.discountValue = discountValue || existingOffer.discountValue;
    existingOffer.maximumAmount = maximumAmount || existingOffer.maximumAmount;
    existingOffer.startDate = startDate || existingOffer.startDate;
    existingOffer.expiryDate = expiryDate || existingOffer.expiryDate;
    existingOffer.status = status || existingOffer.status;
    existingOffer.product = product || existingOffer.product;
    existingOffer.category = category || existingOffer.category;
    await existingOffer.save();

    res.status(200).json({ message: 'Offer updated successfully', existingOffer })
})

const getOfferList = asyncHandler(async (req, res, next) => {
  const offer = await Offer.find().sort({ offerName: -1 })
      .populate("product")
  res.json(offer)
})

module.exports = {
  renderCreateOffer,
  renderEditOffer,
  renderOfferList,
  createOffer,
getOfferList,
  updateOffer,
}

