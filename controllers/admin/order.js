const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Order = require("../../models/order")
const Wallet = require("../../models/wallet")
const Offer = require("../../models/offer")
const Coupon = require("../../models/coupon")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate, formatDateISO } = require("../../utils/date")
const jwt = require("jsonwebtoken")
const moment = require("moment");
const colors = require("colors")
const puppeteer = require("puppeteer")
const express = require("express")
const router = express.Router()
const { getSalesReportData } = require('../../utils/salesReportUtil');
const { generatePdfReport, generateExcelReport } = require('../../utils/reportGenerator');
//get order

const getAdminOrderList = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user")
    .sort({ created_at: -1 }) // Sort by created_at in descending order (-1 for descending, 1 for ascending)
    .exec();

  const PAGE_SIZE = 7; // Number of transactions per page
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);


  const paginatedOrders = orders
    .sort((a, b) => b.date - a.date)
    .slice(skip, skip + PAGE_SIZE);

  res.render(`./admin/orderList`, { orders: paginatedOrders, formatDate, currentPage: page, totalPages, PAGE_SIZE })
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
  const { status } = req.body;
  let updateData = { ...req.body };

  // If status is being updated to 'delivered', set the deliveryDate
  if (status === 'delivered') {
    updateData.deliveryDate = new Date();
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!order) {
    return next(new ErrorResponse(`Order Not Found`, 404));
  }

  console.log(`Order ${order._id} status updated to ${status}`);

  res.status(200).json({
    success: true,
    data: order
  });
});

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
    const returnedItem = order.items[productIndex]

    // Restore Stock
    await Products.findByIdAndUpdate(returnedItem.productId, { $inc: { stockCount: returnedItem.quantity } });

    // Calculate Pro-rated Refund
    const amount = order.calculateItemRefund(returnedItem.productId);

    const wallet = await Wallet.findOrCreate(order.user);
    wallet.addTransaction('credit', amount, `Refund for the return of ${returnedItem.quantity} ${returnedItem.name}(s).`);
    await wallet.save()
    await order.save();
    res.status(200).json({
      success: true,
      message: 'Product return request accepted successfully',
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

    // Loop through all items to calculate total refund and restore stock
    let totalRefundAmount = 0;

    for (const item of order.items) {
      // Only refund if not already returned/cancelled
      if (!item.request || item.request.status !== 'accepted') {
        const itemRefund = order.calculateItemRefund(item.productId);
        totalRefundAmount += itemRefund;

        // Restore Stock
        await Products.findByIdAndUpdate(item.productId, { $inc: { stockCount: item.quantity } });

        // Mark as returned
        item.request = { type: 'return', status: 'accepted' };
      }
    }

    const wallet = await Wallet.findOrCreate(order.user);
    wallet.addTransaction('credit', totalRefundAmount, `Refund for return of order ${order._id}`);
    await wallet.save();

    await order.save();
    // const amount =order.calculateRefundAmount() // Deprecated use
    console.log(`refundable amount is ${totalRefundAmount}`.bgRed)
    res.status(200).json({
      success: true,
      message: 'Order return accepted successfully',
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

const renderSalesReport = asyncHandler(async (req, res) => {
  res.render('./admin/salesReport');
});

const generateSalesReport = asyncHandler(async (req, res) => {
  try {
    const { filterType, startDate, endDate } = req.body;
    console.log(`Filter Type: ${filterType}, Start Date: ${startDate}, End Date: ${endDate}`);

    const report = await getSalesReportData(startDate, endDate, filterType);
    console.log('Generated Report:', report);

    if (report && report.length > 0) {
      const totalRevenue = report.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalSales = report.reduce((sum, item) => sum + item.totalSales, 0);
      const totalDiscount = report.reduce((sum, item) => sum + item.totalDiscount, 0);
      const totalNetRevenue = report.reduce((sum, item) => sum + item.netRevenue, 0);

      res.json({
        success: true,
        data: report,
        summary: { totalRevenue, totalSales, totalDiscount, totalNetRevenue }
      });
    } else {
      res.json({ success: true, data: [], message: 'No sales data available for the selected period.' });
    }
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ success: false, message: 'Error generating sales report', error: error.message });
  }
});

const downloadPdf = asyncHandler(async (req, res) => {
  try {
    const { filterType, startDate, endDate } = req.query;
    console.log(`Downloading PDF - Filter Type: ${filterType}, Start Date: ${startDate}, End Date: ${endDate}`);

    const salesReport = await getSalesReportData(startDate, endDate, filterType);
    console.log(`${salesReport}.red`)
    const reportHtml = await generatePdfReport(salesReport);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(reportHtml);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Disposition', `attachment; filename="sales_report_${startDate}_${endDate}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF report', error: error.message });
  }
});

const downloadExcel = asyncHandler(async (req, res) => {
  try {
    const { filterType, startDate, endDate } = req.query;
    console.log(`Downloading Excel - Filter Type: ${filterType}, Start Date: ${startDate}, End Date: ${endDate}`);

    const salesReport = await getSalesReportData(startDate, endDate, filterType);
    const excelBuffer = await generateExcelReport(salesReport);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generating Excel report:', error);
    res.status(500).json({ success: false, message: 'Error generating Excel report', error: error.message });
  }
});

async function aggregateTransactions() {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);

    const aggregationResult = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$payment_method',
          totalTransactions: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $in: ['$status', ['delivered', 'processing', 'shipped']] },
                '$totalAmount',
                { $multiply: ['$totalAmount', -1] } // For refunds
              ]
            }
          },
          averageOrderValue: { $avg: '$totalAmount' },
          totalItems: { $sum: '$items.quantity' },
          minOrderValue: { $min: '$totalAmount' },
          maxOrderValue: { $max: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    console.log('Transaction Aggregation Results:', aggregationResult);
    return aggregationResult;
  } catch (error) {
    console.error('Error in transaction aggregation:', error);
    throw error;
  }
}

async function getAllTransactions() {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);

    const transactions = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: thirtyDaysAgo }
        }
      },
      {
        $project: {
          orderId: '$_id',
          type: {
            $cond: [
              { $in: ['$status', ['delivered', 'processing', 'shipped']] },
              'payment',
              'refund'
            ]
          },
          amount: '$totalAmount',
          date: '$created_at',
          status: '$status',
          payment_method: 1
        }
      },
      { $sort: { date: -1 } }
    ]);

    return transactions;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
}

const renderTransactionsList = asyncHandler(async (req, res, next) => {
  try {
    const aggregatedData = await aggregateTransactions();
    const allTransactions = await getAllTransactions();

    res.render('./admin/transactionsList', {
      formatDateISO,
      transactions: aggregatedData,
      allTransactions: allTransactions
    });
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    res.status(500).send('Error fetching transaction data');
  }
});

module.exports = {
  getCheckout,
  getAdminOrderList,
  renderTransactionsList,
  createOrder,
  test,
  getOrderById,
  updateOrderById,
  manageProductReturn,
  manageOrderReturn,
  renderSalesReport,
  generateSalesReport,
  downloadPdf,
  downloadExcel,
}
