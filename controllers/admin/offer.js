const Products = require("../../models/products");
const Offer = require("../../models/offer");
const Categories = require("../../models/category");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { formatDate , formatDateISO} = require("../../utils/date")

const renderCreateOffer = asyncHandler(async (req, res, next) => {

  const product = await Products.find().sort({ name: 1 });
  const category = await Categories.find().sort({ name: 1 });
  res.render(`./admin/createOffer`, { product, category });
});

const renderEditOffer = asyncHandler(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
console.log(`${offer}`.yellow)

  res.render(`./admin/offerEdit`, {offer});

});


const renderOfferList = asyncHandler(async (req, res, next) => {
    const offers = await Offer.find();
    const activeOffers = await Offer.find({status:true})
  console.log(`${offers.length}`) 

    res.render('./admin/offerList', { items: offers , activeOffers:activeOffers.length});
});


const createOffer = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      maxAmt,
      minAmt
    } = req.body;

console.log(`that is the name ${name}`)
    // Check if an offer with the same name already exists
    const existingOffer = await Offer.find({ name:name });
   console.log(`existing offer ${existingOffer}`.yellow) 
  
    if (existingOffer.length!=0) {
      return res.status(400).json({ message: 'Offer with this name already existsss' });
    }

    // Validate the input data (additional validations can be added as needed)
    if (!name || !description || !discountPercentage || !startDate || !endDate || !maxAmt || !minAmt) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
      return res.status(400).json({ message: 'Valid discount percentage is required (1-100)' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after the start date' });
    }

    if (isNaN(maxAmt) || maxAmt <= 0) {
      return res.status(400).json({ message: 'Valid maximum amount is required' });
    }

    if (isNaN(minAmt) || minAmt <= 0) {
      return res.status(400).json({ message: 'Valid minimum amount is required' });
    }

    // Create and save the new offer
    const offer = new Offer(req.body);
    await offer.save();

    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const updateOffer = asyncHandler(async (req, res, next) => {
  if (req.query.change) {
    const changeStatus = await Offer.findById(req.params.id);
    changeStatus.status = !changeStatus.status;
    await changeStatus.save();
    return res.status(200).json({ success: true, message: 'Offer status updated' });
  }

  let { name, description, discountPercentage, startDate, endDate, maxAmt, minAmt, status } = req.body;
console.log(`name is ${name}`.red)
  try {
    const existingOffer = await Offer.findById(req.params.id);
    if (!existingOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Check for existing offer with the same name (case-insensitive)
    const existingOfferName = await Offer.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    });

    if (existingOfferName) {
      return res.status(409).json({
        success: false,
        error: "Offer with this name already exists"
      });
    }

    // Update existingOffer details
    existingOffer.name = name || existingOffer.name;
    existingOffer.description = description || existingOffer.description;
    existingOffer.discountPercentage = discountPercentage || existingOffer.discountPercentage;
    existingOffer.startDate = startDate || existingOffer.startDate;
    existingOffer.endDate = endDate || existingOffer.endDate;
    existingOffer.maxAmt = maxAmt || existingOffer.maxAmt;
    existingOffer.minAmt = minAmt || existingOffer.minAmt;
    existingOffer.status = status !== undefined ? status : existingOffer.status;

    await existingOffer.save();

    res.status(200).json({ success:true,message: 'Offer updated successfully', existingOffer });
  } catch (error) {
    res.status(409).json({ success: false, error: "Error updating offer" });
  }
});

const getOfferList = asyncHandler(async (req, res, next) => {
 try {
      const offers = await Offer.find();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = {
  renderCreateOffer,
  renderEditOffer,
  renderOfferList,
  createOffer,
  updateOffer,
  getOfferList,
};
