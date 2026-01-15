const User = require("../../models/users");
const Products = require("../../models/products");
const Category = require("../../models/category");
const Order = require("../../models/order");
const ErrorResponse = require(`../../utils/errorResponse`);
const asyncHandler = require("../../middleware/async");
const { formatDate } = require("../../utils/date")
const colors = require("colors")
const { getCustomDateRangeData, getDailyDataArray, getMonthlyDataArray, getYearlyDataArray, getWeeklyDataArray } = require('../../utils/chartDate');
const { getTopSellingProducts, getTopSellingCategories, getTopSellingSubcategories } = require('../../utils/bestSelling');
const getAllAdminData = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Basic statistics
    const [
      totalRevenue,
      totalUsers,
      totalOrders,
      totalProducts,
      totalCategories,
      monthlyEarnings
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $unwind: "$items" },
        {
          $match: {
            $or: [
              { "items.request.status": { $exists: false } },
              { "items.request.status": null },
              { "items.request.status": { $ne: "accepted" } }
            ]
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        }
      ]),
      User.countDocuments({ status: 1 }),
      Order.countDocuments(),
      Products.countDocuments(),
      Category.countDocuments(),
      Order.aggregate([
        {
          $match: {
            status: "delivered",
            created_at: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          }
        },
        { $unwind: "$items" },
        {
          $match: {
            $or: [
              { "items.request.status": { $exists: false } },
              { "items.request.status": null },
              { "items.request.status": { $ne: "accepted" } }
            ]
          }
        },
        {
          $group: {
            _id: null,
            monthlyAmount: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        }
      ])
    ]);

    // Recent orders with pagination
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // Summary data
    const totalRevenueValue = totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
    const monthlyEarningsValue = monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;

    res.status(200).json({
      totalRevenue: totalRevenueValue,
      monthlyEarnings: monthlyEarningsValue,
      totalUsers,
      totalOrders,
      totalProducts,
      totalCategories,
      recentOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit)
    });
  } catch (err) {
    return next(new ErrorResponse(`Error fetching data: ${err.message}`, 500));
  }
});

const getSalesDatas = asyncHandler(async (req, res) => {
  const { groupBy = 'yearly', startDate, endDate } = req.query;

  let salesData;

  switch (groupBy) {
    case 'daily':
      salesData = await getDailyDataArray();
      break;
    case 'weekly':
      salesData = await getWeeklyDataArray();
      break;
    case 'monthly':
      salesData = await getMonthlyDataArray();
      break;
    case 'yearly':
      salesData = await getYearlyDataArray();
      break;
    case 'custom':
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required for custom range' });
      }
      salesData = await getCustomDateRangeData(new Date(startDate), new Date(endDate));
      break;
    default:
      return res.status(400).json({ message: 'Invalid groupBy parameter' });
  }

  const labels = salesData.map(item => item.week || item.day || item.month || item.year || item.date);
  const counts = salesData.map(item => item.count);

  res.json({
    labels,
    data: counts,
  });
});

// Separate endpoints for specific data
const getBestSellingData = asyncHandler(async (req, res, next) => {
  const { type = 'products', limit = 10 } = req.query;

  try {
    let bestSellingData;

    switch (type.toLowerCase()) {
      case 'products':
        bestSellingData = await getTopSellingProducts(parseInt(limit));
        break;
      case 'category':
        bestSellingData = await getTopSellingCategories(parseInt(limit));
        break;
      case 'subcategory':
        bestSellingData = await getTopSellingSubcategories(parseInt(limit));
        break;
      default:
        return res.status(400).json({ message: 'Invalid type parameter' });
    }

    if (bestSellingData.length === 0) {
      return res.status(404).json({ message: "No best selling data found" });
    }
    console.log(`best selling data ${bestSellingData}`.red)

    const PAGE_SIZE = 2; // Number of transactions per page
    const page = parseInt(req.query.chart2) || 1;
    // console.log(`${(req.query.page)}`.red)
    const skip = (page - 1) * PAGE_SIZE;


    const totalItems = bestSellingData.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const paginatedItems = bestSellingData
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + PAGE_SIZE);
    res.status(200).json({
      bestSellingData: paginatedItems,
      pagination: {
        currentChart: page,
        totalChart: totalPages,
        PAGE_SIZE: PAGE_SIZE
      }
    });
    // res.status(200).json(bestSellingData);
  } catch (err) {
    return next(new ErrorResponse(`Error fetching best selling data: ${err.message}`, 500));
  }
});

const getBestSellingProducts = asyncHandler(async (req, res, next) => {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $match: {
          $or: [
            { "items.request.status": { $exists: false } },
            { "items.request.status": null },
            { "items.request.status": { $ne: "accepted" } }
          ]
        }
      },
      {
        $group: {
          _id: "$items.productId",
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          product: "$product.name",
          totalSales: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);
    console.log(`${JSON.stringify(bestSellingProducts)}`.green);
    res.status(200).json(bestSellingProducts);

  } catch (err) {
    return next(new ErrorResponse(`Error fetching best selling products: ${err.message}`, 500));
  }
});

const getRecentOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

  const total = await Order.countDocuments();

  res.json({
    orders,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Export the functions
module.exports = {
  getAllAdminData,
  getSalesDatas,
  getBestSellingProducts,
  getRecentOrders,
  getBestSellingData
};
