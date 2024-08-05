const Products = require("../../models/products")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const User = require("../../models/users")
const Offer = require("../../models/offer")
const Cart = require("../../models/cart")
const Wallet = require("../../models/wallet")
const { applyOffersToCartItems } = require('../../utils/offer');


const getCart = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new ErrorResponse('User not authenticated', 401));
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  const cart = await Cart.findOne({ user: user.id }).populate('items.productId');
  if (!cart) {
    const newCart = await Cart.create({ user: user.id, items: [] });
    req.session.cartId = newCart.id;
  } else {
    req.session.cartId = cart.id;
  }
  req.session.user = user;
  if (cart && cart.items) {
    cart.items = cart.items.filter(item => item.productId !== null);
    await cart.save();
  }
  res.render("./users/cart", { 
    user, 
    cart: cart || { items: [] }  
  });
});




const getCartList = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Find the cart and populate product details
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: 'items.productId',
      select: 'name price image stockCount offer',
      populate: {
        path: 'offer',
      }
    });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Process cart items to include offer details and calculate totals
  const processedItems = cart.items.map(item => {
    const product = item.productId;
    let discountedPrice = product.price;
    let offerDetails = null;

    console.log(`${product.offer}`.blue)
    if (product.offer && product.offer.isApplicable(product.price)) {
      discountedPrice = product.offer.applyDiscount(product.price);
      offerDetails = {
        discountPercentage: product.offer.discountPercentage,
        startDate: product.offer.startDate,
        endDate: product.offer.endDate
      };
    }

    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      discountedPrice,
      image: product.image,
      quantity: item.quantity,
      stockCount: product.stockCount,
      offerDetails,
      subtotal: discountedPrice * item.quantity
    };
  });

  const cartTotal = processedItems.reduce((total, item) => total + item.subtotal, 0);
console.log(`${cartTotal}`.yellow)
  res.json({
    cartId: cart._id,
    userId,
    items: processedItems,
    billTotal:cartTotal,
    itemCount: processedItems.length
  }).status(200);
});

const getCheckout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  req.user = user;

  const cart = await Cart.findOne({ user: user.id });
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
console.log(`${cart}`.red)
  let shippingTotal = 0;
  let needsAddress = false;
  if (user.shipping_address ) {
    shippingTotal = calculateShippingTotal(user.shipping_address);
  } else if( !user.shipping_address && user.addresses.length<0) {
    needsAddress = true;
  }
console.log(`bill total is ${cart.billTotal}`.red)
  const totalAmount = calculateTotalAmount(cart.billTotal, shippingTotal);

  const CLIENT_ID = process.env.RAZORPAY_ID;
  if (!CLIENT_ID) {
    return res.status(500).json({ message: 'Payment service configuration error' });
  }

  const wallet = await Wallet.findOrCreate(user.id);
  wallet.balance = parseFloat(wallet.balance).toFixed(2);

  logCheckoutDetails(user, cart.items, cart.billTotal, shippingTotal, totalAmount, wallet.balance);
  res.render('./users/checkoutG', {
    CLIENT_ID,
    user,
    products: cart.items,
    cart,
    shippingTotal,
    totalAmount,
    walletBalance: wallet.balance,
    needsAddress
  });
});

function calculateShippingTotal(shippingAddress) {

  if (!shippingAddress || !shippingAddress.country) {
    return 0;
  }

  const shippingRates = {
    'United States': 0,
    'Canada': 0,
    'Mexico': 5,
    'India': 5,
  };

  return shippingRates[shippingAddress.country] || 0;
}

function calculateTotalAmount(billTotal, shippingTotal) {
  const tax = 0.05 * billTotal;
  return billTotal + tax + (typeof shippingTotal === 'number' ? shippingTotal : 0);
}

function logCheckoutDetails(user, products, billTotal, shippingTotal, totalAmount, walletBalance) {
  // console.log('CLIENT_ID:', process.env.RAZORPAY_ID);
  // console.log('User:', JSON.stringify(user, null, 2));
  // console.log('Products:', JSON.stringify(products, null, 2));
  // console.log('Cart Total:', billTotal);
  // console.log('Shipping Total:', shippingTotal);
  // console.log('Total Amount:', totalAmount);
  // console.log('Wallet Balance:', walletBalance);
}




// Controller for handling cart operations

// Add item to cart
const addItemToCart = asyncHandler(async (req, res, next) => {
  let { user, productId, image, name, productPrice, quantity, offerId } = req.body
  quantity = Number(quantity)
  // Find the product and check stock
  const product = await Products.findById(productId)

  if (!product || product.stockCount < quantity) {
    return res.status(400).json({ message: "Product not available in requested quantity" })
  }


  // Apply discount if offer is valid
  let discountedPrice = productPrice

 const  offer = await Offer.findById(product.offer)
  if (offer && offer.isApplicable(product.price)) {
    discountedPrice = offer.applyDiscount(product.price);

  }
console.log(`discounted price is ${discountedPrice}`)
  let cart = await Cart.findOne({ user })
  if (!cart) {
    cart = new Cart({ user, items: [] })
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  )

  let billTotal

  if (existingItem) {
    existingItem.quantity += quantity
    existingItem.productPrice = discountedPrice // Update price in case offer changed
  } else {
    cart.items.push({ productId, image, name, productPrice: discountedPrice, quantity, offerId })
  }
  console.log(` discount price ${discountedPrice}`.toUpperCase().red)
  // Update product stock
  product.stockCount -= quantity
  await product.save()

  // Save cart
console.log(`${cart}`.magenta)
cart.billTotal+=Number(discountedPrice)
  await cart.save()

  res.redirect("/cart")
})



const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  const product = await Products.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than zero' });
  }

  if (quantity > 10) {
    return res.status(400).json({ message: 'You can only buy up to 10 quantities' });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (cartItemIndex === -1) {
    return res.status(404).json({ message: 'Product not found in cart' });
  }

  const currentQuantity = cart.items[cartItemIndex].quantity;
  const quantityDifference = quantity - currentQuantity;

  if (quantityDifference > 0 && product.stockCount < quantityDifference) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  // Update quantity
  cart.items[cartItemIndex].quantity = quantity;

  // Apply offer if exists
  if (product.offer) {
    const offer = await Offer.findById(product.offer);
    if (offer && offer.isApplicable(product.price)) {
      cart.items[cartItemIndex].productPrice = offer.applyDiscount(product.price);
    } else {
      cart.items[cartItemIndex].productPrice = product.price;
    }
  }

  // Recalculate bill total
  cart.billTotal = cart.items.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

  // Update product stock
  product.stockCount -= quantityDifference;

  // Save changes
console.log(`${cart}`.grey)
  await Promise.all([cart.save(), product.save()]);
  res.status(200).json(cart);
});




// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId
  const cart = await Cart.findById(req.session.cartId)
  console.log(`${req.body.quantity}`.bgRed)
  const product = await Products.findById(productId)
  cart.items = cart.items.filter((item) => item.productId.toString()!== productId)

  await applyOffersToCartItems(cart.items); // Apply offers
  cart.billTotal = calculateBillTotal(cart.items);
  await cart.save()

  res.status(200).json({ success: true ,data:cart})
})

// Get cart details
const getCartDetails = asyncHandler(async (req, res, next) => {
  const { user } = req.params

  const cart = await Cart.findOne({ user })

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  res.status(200).json(cart)
  if (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Mark item as selected or unselected in cart
const updateItemSelectedStatus = async (req, res) => {
  try {
    const { user, productId, selected } = req.body

    const cart = await Cart.findOne({ user })

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    )

    if (!item) {
      return res.status(404).json({ error: "Item not found in the cart" })
    }

    item.selected = selected

    // Save the updated cart
    await cart.save()

    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// Helper function to calculate the bill total based on items in the cart
const calculateBillTotal = (items) => {
  return items.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  )
}

module.exports = {
  getCart,
  getCheckout,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  getCartDetails,
  updateItemSelectedStatus,
  getCartList
}
