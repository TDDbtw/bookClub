const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Order = require("../../models/order")
const Offer = require("../../models/offer")
const Coupon = require("../../models/coupon")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate } = require("../../utils/date")
const jwt = require("jsonwebtoken") 
const moment = require("moment");
const colors = require("colors")
const express = require("express")
const router = express.Router()
const { getSalesReportData } = require('../../utils/salesReportUtil');
const { generatePdfReport, generateExcelReport } = require('../../utils/reportGenerator');
//get order

const getAdminOrderList = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user").exec()
  res.render(`./admin/orderList`, { orders ,formatDate})
  // res.json("./admin")
  // res.send(order)
})
const getCheckout = asyncHandler(async (req, res, next) => {
  res.render(`./users/order`)
})
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  const user = await User.findById(order.user._id)
  createdDate = formatDate(order.created_at)

  res.render(`./admin/orderEdit`, { order, user, createdDate })
})

//
// Create Order
//
const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { totalAmount, payment_method } = req.body
    const user = await User.findById(req.user.id)
    console.log(user)
    const cart = await Cart.findOne({ user: user.id })
    console.log(cart)

    if (!user || !cart) {
      return next(new ErrorResponse("User or cart not found", 404))
    }

    console.log(`this is order -->${cart}`)
    res.redirect("/order")
  } catch (error) {
    
    console.error(error)
    next(new ErrorResponse("Internal Server Error", 500))
  }
})

//
// Get All Orders
//
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()

    res.status(200).send(orders)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Get Single Order
//
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return next(new ErrorResponse(`Order Not Found`, 404))
    }
    res.status(200).send(order)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update Order
//
const updateOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!order) {
    return next(new ErrorResponse(`Order Not Found`, 404))
  }
  res.status(200).send(order)
})


const manageProductReturn = async (req, res, next) => {
 try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    const productIndex = order.items.findIndex(item => item.productId.toString() == req.params.productId);
console.log(`${req.params.productId}`.red)

console.log(`${productIndex}`.blue)
    if (productIndex === -1) {
      return next(new ErrorResponse('Product not found in order', 404));
    }


order.items[productIndex].request = {
      type: 'return',
      status: 'accepted',
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



const manageOrderReturn = async (req, res, next) => {
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
   status: 'accepted',
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

// Delete Order
//

router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
      return res.status(404).send("Order not found")
    }
    res.status(200).send(order)
  } catch (error) {
    res.status(500).send(error)
  }
})
const test = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
  const subcategories = await Subcategories.find()

  res.json({ subcategories })
})

// sales report

const renderSalesReport = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user").exec()
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalSales = orders.length;
    const totalProductsSold = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  res.render(`./admin/salesReport`, { orders ,formatDate ,totalRevenue,totalSales,totalProductsSold})
})

const getSalesReport = asyncHandler(async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    const salesReport = await getSalesReportData(filter, startDate, endDate);
    res.json(salesReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the sales report' });
  }
});


const downloadPdf = asyncHandler(async (req, res, next) => {

    try {
    const { filter, startDate, endDate } = req.query;
    const salesReport = await getSalesReportData(filter, startDate, endDate);
    const pdfBuffer = await generatePdfReport(salesReport);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the PDF report' });
  }
})

const downloadExcel = asyncHandler(async (req, res, next) => {

try {
    const { filter, startDate, endDate } = req.query;
    const salesReport = await getSalesReportData(filter, startDate, endDate);
    const excelBuffer = await generateExcelReport(salesReport);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
    res.send(excelBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the Excel report' });
  }

})
module.exports = {
  getCheckout,
  getAdminOrderList,
  createOrder,
  test,
  getOrderById,
  updateOrderById,
manageProductReturn,
manageOrderReturn,
  renderSalesReport,
  getSalesReport,
  downloadPdf,
  downloadExcel,
}
