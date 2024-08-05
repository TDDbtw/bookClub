
const Offer = require('../models/offer');

const fetchActiveOffers = async () => {
  const offers = await Offer.find({ status: true });
  return offers;
};

const calculateDiscountedPrice = (originalPrice, offer) => {
  let discountedPrice = originalPrice;

  if (offer.discountType === 'Percentage') {
    const discountAmount = originalPrice * (offer.discountValue / 100);
    discountedPrice = Math.max(originalPrice - discountAmount, 0);
  } else if (offer.discountType === 'Amount') {
    discountedPrice = Math.max(originalPrice - offer.discountValue, 0);
  }

  return Math.min(discountedPrice, offer.maximumAmount);
};

const applyOffersToCartItems = async (cartItems) => {
  const offers = await fetchActiveOffers();
  let totalDiscount = 0;

  cartItems.forEach(item => {
    offers.forEach(offer => {
// console.log(`product is ${offer.product} \n  ${offer.product} \n  item product id is ${item.productId}`.red)
// console.log(`category is ${offer.category} \n  ${offer.category} \n  item product id is ${item.categoryId}`.yellow)
      if (offer.product && offer.product === item.productId ||
          offer.category && offer.category === item.categoryId) {
        const discountedPrice = calculateDiscountedPrice(item.productPrice, offer);
        totalDiscount += (item.productPrice - discountedPrice) * item.quantity;
        item.productPrice = discountedPrice;
      }
    });
  });

  return totalDiscount;
};

module.exports = {
  fetchActiveOffers,
  applyOffersToCartItems,
  calculateDiscountedPrice,
};
