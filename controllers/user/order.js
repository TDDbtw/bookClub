const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const moment = require("moment")
const Razorpay= require('razorpay')
const User = require("../../models/users")
const Cart = require("../../models/cart")
const Product = require("../../models/products")
const Order = require("../../models/order")
const Coupon= require("../../models/coupon")
const express = require("express")
const Subcategories = require("../../models/subcategory")
const crypto = require("crypto")
const { formatDate } = require("../../utils/date")
const router = express.Router()




//get order
const getUserOrder = async (req, res, next) => {

  try {
    const user = await User.findById(req.user.id)
    const cart = await Cart.findOne({ user: user.id })
    const orders = await Order.find({ user: user.id })
      .sort({ 'createdAt': -1 }) 
      .populate({
        path: 'items.productId',
        select: 'name' 
      })
      .exec();
    const products = orders.flatMap((order) =>
      order.items.filter((item) => item.name)
    )

    res.render("./users/ordersList", { user, orders, products,moment })
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
getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user").exec()
  const user = await User.findById(order.user._id)
  const createdDate = moment(order.created_at).format('MM/DD/YYYY')
  const deliveryDate = moment(order.deliveryDate).format('MM/DD/YYYY')
const ID=order._id


  const cancelledItemCount = order.items.filter(item => item.request?.type === 'cancel').length;
  const returnedItemCount = order.items.filter(item => item.request?.type === 'return').length;
  const allCancelled=order.items.length ===cancelledItemCount 
  const allReturned=order.items.length ===returnedItemCount 

   console.log(`cancel count ${allCancelled }`.red) 
  res.render(`./users/order`, { order, user, createdDate,deliveryDate,ID,allCancelled,allReturned })
})


const createOrder = asyncHandler(async (req, res, next) => {
  try {
    let userData = JSON.parse(req.body.user);
    const user = await User.findById(userData._id);

    let shippingTotal = "";
    switch (user.shipping_address.country) {
      case "United States":
        shippingTotal = 0;
        break;
      case "Canada":
        shippingTotal = 0;
        break;
      case "Mexico":
        shippingTotal = 10;
        break;
      case "India":
        shippingTotal = 20;
        break;
      default:
        break;
    }

    console.log(`Shipping Total: ${shippingTotal}`);

    let cart = await Cart.findOne({ user: user._id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productPrice * item.quantity,
      0
    );
    console.log(`Total Amount before shipping and tax: ${totalAmount}`.bgRed);

    totalAmount = parseFloat(totalAmount) + shippingTotal + parseFloat(totalAmount) * 0.05;
    totalAmount = Number(totalAmount).toFixed(2);

    console.log(`Total Amount after shipping and tax: ${totalAmount}`);

    let discount = 0;
    if (req.body.coupon) {
      try {
        discount = req.body.coupon.discount || 0;
        totalAmount = req.body.coupon.newTotalAmount || totalAmount;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    console.log(`Discount: ${discount}`);
    console.log(`Total Amount after discount: ${totalAmount}`.bgBlue);

    totalAmount = Number(totalAmount).toFixed(2);
    console.log(`Final Total Amount: ${totalAmount}`);

    const orderData = {
      user: cart.user,
      totalAmount: totalAmount,
      discount: discount,
      payment_method: req.body.payment_method,
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

    let reduceQuantity = cart.items.map((item) => item.productId);

    console.log(`Reduce Quantity: ${reduceQuantity}`.bgYellow);
    req.totalAmount = totalAmount;

    console.log("Successfully created Order");

    if (req.body.coupon.couponCode) {
      const couponUpdate = await Coupon.findOne({ code: req.body.coupon.couponCode });
      couponUpdate.claimedBy.push(user._id);
      couponUpdate.limit -= 1;
      await couponUpdate.save();
    }

    cart.items = [];
    cart.billTotal = 0;
    await cart.save();

    const order = new Order(orderData);

    await order.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


const razorpayOrder = asyncHandler(async (req, res, next) => {

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}); 
  try {

    let userData = JSON.parse(req.body.user);
    const user = await User.findById(userData._id);


    if (!user ) {
      return res.status(500).json({ success: false, error: "User not found." });
    }

    let shippingTotal = "";
    switch (user.shipping_address.country) {
      case "United States":
        shippingTotal = 0;
        break;
      case "Canada":
        shippingTotal =  0;
        break;
      case "Mexico":
        shippingTotal = 5;
        break;
      case "India":
        shippingTotal = 10;
        break;
      default:
        break;
    }

    let cart = await Cart.findOne({ user: user._id }).populate("items.productId");


    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }


    let totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productPrice * item.quantity,
      0
    );
    totalAmount = parseFloat(totalAmount) + shippingTotal +( parseFloat(totalAmount) * 0.05)
    totalAmount = Number(totalAmount).toFixed(2);
  console.log(`bfr discount ${totalAmount}`.bgBlue) 
    let discount = 0;
    if (req.body.coupon) {
      try {
        discount = req.body.coupon.discount||0;
          totalAmount = req.body.coupon.newTotalAmount||totalAmount;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

   console.log(`${discount}`.red ) 
    totalAmount = Number(totalAmount).toFixed(2);
console.log(`total amout befor ${totalAmount}`.red)

    const options = {
      amount:  Math.round(totalAmount * 100),
      currency: 'USD',
      receipt: `order_${Date.now()}`, 
      payment_capture: 1,
    };

    instance.orders.create(options, async (err, razorpayOrder) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(400).json({ success: false, error: "Payment Failed", user });
      } else {
        // Payment succeeded, proceed to create the order
        const order = new Order({
          
      user: cart.user,
      totalAmount: totalAmount,
      discount: discount,
      payment_method: req.body.payment_method,
      shipping_address: user.shipping_address,
      billing_address: user.billing_address,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productPrice,
        quantity: item.quantity,
        image: item.image,
          })),
        });

        try {
          // await order.save();
          // Send success response as the order creation and payment were successful
          return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: razorpayOrder,
          });
        } catch (error) {
          console.error("Error creating Order:", error);
          return res.status(400).json({ success: false, error: "Failed to create order" });
        }
      }
    });

   
  } catch (error) {
    console.error("An error occurred while placing the order: ", error);
    return res.status(400).json({ success: false, error: "Payment Failed" });
  }
})



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
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    if (order.status === 'cancelled' || order.status === 'delivered') {
      return next(new ErrorResponse('Cannot cancel this order', 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Return the entire order
const returnOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
console.log(`${order}`.red)
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
     console.log(`${productId}`.red)
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




const testOrder = asyncHandler(async (req, res, next) => {
  // const orders = await Order.find()
  console.log(req.body)

  res.json(req.body)
})



module.exports = {
  getCheckout,
  getOrderSuccess,
  getUserOrder,
  createOrder,
  getOrders,
cancelOrReturnOrder,
  cancelOrder,
  returnOrder,
  cancelProduct,
  returnProduct,
  testOrder,
  razorpayOrder,
}
