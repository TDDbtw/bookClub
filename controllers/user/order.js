const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const moment = require("moment")
const puppeteer = require('puppeteer');
const Razorpay= require('razorpay')
const User = require("../../models/users")
const Cart = require("../../models/cart")
const Wallet = require("../../models/wallet")
const Offer = require("../../models/offer")
const Order = require("../../models/order")
const Coupon= require("../../models/coupon")
const { generateOrderInvoice} = require('../../utils/reportGenerator');



//get order
const getUserOrder = async (req, res, next) => {

  try {

    const user = await User.findById(req.user.id)
    const cart = await Cart.findOne({ user: user.id })
    const orders = await Order.find({ user: user.id })
      .sort({ 'created_at': -1 }) 
      .populate({
        path: 'items.productId',
        select: 'name' 
      })
      .exec();
    const PAGE_SIZE = 4; // Number of transactions per page
    const page = parseInt(req.query.page) || 1;
    // console.log(`${(req.query.page)}`.red)
    const skip = (page - 1) * PAGE_SIZE;


    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

    console.log(`${orders[0]}`.red)
    const paginatedTransactions = orders
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + PAGE_SIZE);
    const products = orders.flatMap((order) =>
      order.items.filter((item) => item.name)
    )

    res.render("./users/ordersList", { user, orders: paginatedTransactions,
      products, 
      moment,currentPage: page,totalPages,PAGE_SIZE
    })
  } catch (error) {

    next(error)
  }
}

const getCheckout = asyncHandler(async (req, res, next) => {
  res.render(`./users/order`)
})

const getOrderSuccess = asyncHandler (async (req,res,next )=>{
  res.render(`./users/orderSuccess`)
}
)
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user").exec()
  const user = await User.findById(order.user._id)
  const createdDate = moment(order.created_at).format('MM/DD/YYYY')
  const deliveryDate = moment(order.deliveryDate).format('MM/DD/YYYY hh:mm A');
  const ID=order._id
  let expectedDeliveryDate = new Date(order.created_at);
  if(order.deliveryDate!=null){
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);
    expectedDeliveryDate=moment(expectedDeliveryDate).format('MM/DD/YYYY')
  }
  else{
    expectedDeliveryDate=null
  }
  const cancelledItemCount = order.items.filter(item => item.request?.type === 'cancel').length;
  const returnedItemCount = order.items.filter(item => item.request?.type === 'return').length;
  const allCancelled=order.items.length ===cancelledItemCount 
  const allReturned=order.items.length ===returnedItemCount 
  const isReturnable=order.isReturnable()
  const  calculateDiscountPercentage=function (originalPrice, discountedPrice) {
    if (originalPrice <= 0) {
      throw new Error("Original price must be greater than zero");
    }
    const percentageOff = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return percentageOff;
  }
  console.log(`discount percentage ${calculateDiscountPercentage}`)
  res.render(`./users/order`, { order, user, createdDate,deliveryDate,calculateDiscountPercentage ,expectedDeliveryDate,ID,allCancelled,allReturned ,isReturnable})
})


const createOrder = asyncHandler(async (req, res, next) => {
  const userData = JSON.parse(req.body.user);
  const user = await User.findById(userData._id);
  const cart = await Cart.findOne({ user: user._id }).populate({
    path: 'items.productId',
    populate: { path: 'offer' }
  });

  if (!user.shipping_address.country || !user.billing_address.country) {
    return res.status(400).json({ error: 'Yo do need to add the address' });
  }

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const shippingTotal = calculateShippingTotal(user.shipping_address.country);

  // Process each item in the order
  const orderItems = await Promise.all(cart.items.map(async (cartItem) => {
    const product = cartItem.productId;

    if (!product) {
      throw new Error(`Product not found for item in cart`);
    }

    let itemPrice = Number(product.price) || 0; // Ensure price is a number

    const orderItem = {
      productId: product._id,
      name: product.name,
      quantity: Number(cartItem.quantity) || 1, // Ensure quantity is a number
      price: itemPrice,
      image: product.image && product.image.length > 0 ? product.image[0] : '',
      offers: []
    };
    // Add offer to the item if it exists on the product
    if (product.offer && product.offer.isApplicable(itemPrice)) {
      const discountedPrice = product.offer.applyDiscount(itemPrice);
      const discountValue = itemPrice - discountedPrice;

      orderItem.offers.push({
        offerName: product.offer.name || 'Unnamed Offer',
        discountValue: discountValue
      });
      console.log(`${discountedPrice}`.red)
      itemPrice = discountedPrice;
    }
    orderItem.price = itemPrice; // Set the final price after applying offer

    return orderItem;
  }));

  // Calculate total amount
  let totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalAmount += shippingTotal;
  let appliedCoupon=[]

  if (req.body.coupon) {
    const { discount, newTotalAmount } = applyCoupon(req.body.coupon, totalAmount);
    const data = {
      code:req.body.coupon.couponCode,
      discount:discount
    }
    appliedCoupon.push(data)
    console.log(`discount is ${discount}`.red);
    totalAmount = newTotalAmount;
  }

  const orderData = {
    ...createOrderData(user, cart, totalAmount, req.body),
    items: orderItems,
    totalAmount: totalAmount
  };

  const order = new Order(orderData);
  console.log(`applied coupon is ${JSON.stringify(appliedCoupon)}`.yellow)
  order.coupons=appliedCoupon
  await order.save();

  if (req.body.payment_method === 'wallet') {
    await handleWalletPayment(user._id, order.totalAmount, order._id);
  }

  if (req.body.coupon?.couponCode) {
    await updateCoupon(req.body.coupon.couponCode, user._id);
  }

  await clearCart(cart);

  res.json({ success: true, order: order });
});

const razorpayOrder = asyncHandler(async (req, res, next) => {
  const userData = JSON.parse(req.body.user);
  const user = await User.findById(userData._id);

  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  }); 

  if (!user) {
    return res.status(500).json({ success: false, error: 'User not found.' });
  }

  const cart = await Cart.findOne({ user: user._id }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!user.shipping_address.country || !user.billing_address.country) {

      throw new Error(`You do need to add the address`);
  }
  const shippingTotal = calculateShippingTotal(user.shipping_address.country);
  let totalAmount = calculateTotalAmount(cart.items, shippingTotal);

  if (req.body.coupon) {
    const { discount, newTotalAmount } = applyCoupon(req.body.coupon, totalAmount);
    totalAmount = newTotalAmount;
  }

  const options = {
    amount: Math.round(totalAmount * 100),
    // currency: 'USD',
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    payment_capture: 1,
  };

  const razorpayOrder = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    order: razorpayOrder,
  });
});


const createFailedOrder = asyncHandler(async (req, res, next) => {
  try {
    const userData = JSON.parse(req.body.user);
    const user = await User.findById(userData._id);
    const cart = await Cart.findOne({ user: user._id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const shippingTotal = calculateShippingTotal(user.shipping_address.country);
    let totalAmount = calculateTotalAmount(cart.items, shippingTotal);

    if (req.body.coupon) {
      const { discount, newTotalAmount } = applyCoupon(req.body.coupon, totalAmount);
      totalAmount = newTotalAmount;
    }

    const orderData = {
      user: user._id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        image: item.productId.image[0] // Assuming the first image is used
      })),
      totalAmount: totalAmount,
      payment_method: req.body.payment_method,
      payment_status: false, // Set to false for failed orders
      status: "Failed", // Set the status to "Failed"
      shipping_address: user.shipping_address,
      billing_address: user.billing_address,
      coupon: req.body.coupon ? req.body.coupon.couponId : undefined,
      couponDiscount: req.body.coupon ? req.body.coupon.discount : 0,
      offerDiscount: req.body.offerDiscount || 0
    };

    const failedOrder = new Order(orderData);
    await failedOrder.save();

    // Optionally, you might want to log the reason for failure
    console.log(`Order ${failedOrder._id} failed. Reason: ${req.body.failureReason || 'Unknown'}`);

    // Don't clear the cart for failed orders
    // await clearCart(cart);

    res.status(200).json({ 
      success: false, 
      message: 'Order failed', 
      orderId: failedOrder._id 
    });
  } catch (error) {
    console.error('Error creating failed order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


// Get all orders of a user

const getOrders = asyncHandler(async (req, res, next) => {
  const user = req.user

  const orders = await Order.find({ user: user._id })

  res.status(200).json({
    status: "success",
    data: orders,
  })

  res.status(500).json({
    status: "failed",
    message: error.message,
  })
})

// Get a single order by id
exports.OrderById = async (req, res) => {
  const user = req.user
  const orderId = req.params.id

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      })
    }

    if (order.user != user._id) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized access",
      })
    }

    res.status(200).json({
      status: "success",
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    })
  }
}

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const user = req.user
  const orderId = req.params.id
  const { status } = req.body

  if (
    !Object.values([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]).includes(status)
  ) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid status value",
    })
  }

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      })
    }

    if (order.user != user._id) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized access",
      })
    }

    order.status = status
    await order.save()

    res.status(200).json({
      status: "success",
      message: "Order status updated",
    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    })
  }
}


const cancelOrReturnOrder = async (req, res, next) => {
  const { action, reason } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
    order.items.forEach(item => {
      item.requests.push({
        type: action, // 'Cancel' or 'Return'
        status: 'Pending',
        reason: reason || 'No reason provided',
      });
    });

    order.status = action === 'Cancel' ? 'cancelled' : 'Return';

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};


// Cancel the entire order


const cancelOrder = asyncHandler(async (req, res, next) => {
  const ID=String(req.params.orderId)
  const order = await Order.findById(ID);
  console.log(`${order}`.red)
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.status === 'cancelled' || order.status === 'delivered') {
    return next(new ErrorResponse('Cannot cancel this order', 400));
  }

  order.status = 'cancelled';
  const cancelledOrder = await order.save();

  if (cancelledOrder) {
    await refundToWallet(order.user, order.calculateTotalAmount(), `Refund for cancelled order ${cancelledOrder._id}`);
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
  });
});


// Return the entire order
const returnOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
    // console.log(`${order}`.red)
    if (order.status !== 'delivered') {
      return next(new ErrorResponse('Only delivered orders can be returned', 400));
    }
    order.returnRequest = { 
      status: 'pending',
      reason: req.body.reason || "Requseted return",
      createdAt: Date.now()
    };
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order return requested successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Cancel an individual product
const cancelProduct = async (req, res, next) => {
  try {
    const { orderId, productId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    const productIndex = order.items.findIndex(item => item.productId.toString() === req.params.productId);
    // console.log(`${productId}`.red)
    if (productIndex === -1) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (order.items[productIndex].request.type === 'cancel' && order.items[productIndex].request.status === 'Pending') {
      return next(new ErrorResponse('already requested for cancellation', 400));
    }

    order.items[productIndex].request = {
      type: 'cancel',
      status: 'accepted',
      reason: 'Customer cancelled the product'
    };

    const cancelledItemCount = order.items.filter(item => item.request?.type === 'cancel').length;
    const returnedItemCount = order.items.filter(item => item.request?.type === 'return').length;
    const allCancelled=order.items.length ===cancelledItemCount 
    const allReturned=order.items.length ===returnedItemCount 
    if(allCancelled){order.status='cancelled'}
    if(allReturned){order.status='returned'}
    const returnedItem=order.items[productIndex]
    const amount=  returnedItem.quantity * returnedItem.price
    const wallet = await Wallet.findOrCreate(order.user);
    if(order.payment_method!=='cod'){
      wallet.addTransaction('credit', amount, `Refund of ${returnedItem.quantity} X  ${returnedItem.name} canceled order`);}
    await wallet.save()
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Product cancel request added successfully',
    });
  } catch (error) {
    next(error);
  }
};
// Return an individual product
const returnProduct = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Find the product within the order's items array
    const productIndex = order.items.findIndex(item => item.productId.toString() === req.params.productId);

    if (productIndex === -1) {
      return next(new ErrorResponse('Product not found in order', 404));
    }

    // console.log(`${req.body.reason}`.red)
    order.items[productIndex].request = {
      type: 'return',
      status: 'pending',
      reason: req.body.reason || 'Customer requested return',
    }

    await order.save();
    res.status(200).json({
      success: true,
      message: 'Product return request added successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }

};



const loadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const user = await User.findById(order.user._id)
    const invoiceHtml = await generateOrderInvoice(order,user); // Function to generate HTML invoice
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHtml);
    const pdfBuffer = await page.pdf({ format: 'Letter' });
    await browser.close();

    res.setHeader('Content-Disposition', `attachment; filename="invoice_${order._id}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ success: false, message: 'Error generating invoice' });
  }
}


function calculateShippingTotal(country) {
  const shippingRates = {
    'United States': 0,
    'Canada': 0,
    'Mexico': 5,
    'India': 5,
  };
  return shippingRates[country] || 0;
}

function calculateTotalAmount(items, shippingTotal) {
  const subtotal = items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
  console.log(`sub total is ${subtotal}`.red)
  const tax = subtotal * 0.05;
  console.log(`shipping total is ${shippingTotal}`.yellow)
  console.log(`tax is  tax ${tax}`.blue)
  console.log(`total is  ${subtotal+tax+ shippingTotal}`.magenta)
  return Number(subtotal + tax + shippingTotal).toFixed(2);
}

function applyCoupon(coupon, totalAmount) {
  const discount = coupon.discount || 0;
  const newTotalAmount = coupon.newTotalAmount || totalAmount;
  return { discount, newTotalAmount: Number(newTotalAmount).toFixed(2) };
}

function createOrderData(user, cart, totalAmount, bodyData) {
  return {
    user: cart.user,
    totalAmount,
    discount: bodyData.coupon ? bodyData.coupon.discount : 0,
    payment_method: bodyData.payment_method,
    shipping_address: user.shipping_address,
    billing_address: user.billing_address,
    items: cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productPrice,
      quantity: item.quantity,
      image: item.image,
    })),
  };
}

async function handleWalletPayment(userId, amount, orderId) {
  const wallet = await Wallet.findOrCreate(userId);
  wallet.addTransaction('debit', amount, `Payment for order ${orderId}`);
  await wallet.save();
}

async function updateCoupon(couponCode, userId) {
  const coupon = await Coupon.findOne({code: { $regex: new RegExp(`^${couponCode}$`, 'i') }});
  // console.log(`${couponCode}`.red)
  coupon.claimedBy.push(userId);
  coupon.limit -= 1;
  await coupon.save();
}

async function clearCart(cart) {
  cart.items = [];
  cart.billTotal = 0;
  await cart.save();
}

async function refundToWallet(userId, amount, reason) {
  const wallet = await Wallet.findOrCreate(userId);
  wallet.addTransaction('credit', amount, reason);
  await wallet.save();
}

const applyItemOffers = (items) => {
  return items.map(item => {
    let totalDiscount = 0;

    if (item.offers && item.offers.length > 0) {
      item.offers.forEach(offer => {
        totalDiscount += (item.price * offer.discountValue) / 100;
      });
    }

    const discountedPrice = item.price - totalDiscount;
    return {
      ...item.toObject(),
      discountedPrice,
    };
  });
};



const testOrder = asyncHandler(async (req, res, next) => {
  // const orders = await Order.find()
  // console.log(req.body)

  res.json(req.body)
})


module.exports = {
  getCheckout,
  getOrderSuccess,
  getUserOrder,
  createOrder,
  getOrderById,
  getOrders,
  cancelOrReturnOrder,
  cancelOrder,
  returnOrder,
  cancelProduct,
  returnProduct,
  testOrder,
  razorpayOrder,
  createFailedOrder,
  loadInvoice,
}
