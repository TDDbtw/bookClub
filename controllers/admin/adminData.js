const User = require("../../models/users");
const Products = require("../../models/products");
const Category = require("../../models/category");
const Order = require("../../models/order");
const ErrorResponse = require(`../../utils/errorResponse`);
const asyncHandler = require("../../middleware/async");
const { formatDate } = require("../../utils/date")
const {
  getDailyDataArray,
  getWeeklyDataArray,
  getMonthlyDataArray,
  getYearlyDataArray,
} = require("../../utils/chartDate");

const getAllAdminData = asyncHandler(async (req, res, next) => {
  try {
    let query = {};

    const products = await Products.find()
      .populate("category")
      .populate("subcategories")
      .exec();
    const users = await User.find();
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    const totalUsers = await User.countDocuments({ status: 1 });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Products.countDocuments();
    const totalCategories = await Category.countDocuments();
    const order = await Order.find().populate("user").limit(10).sort({ created_at: -1 });

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          created_at: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
    ]);

    const salesPerCategory = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalRevenue: { $sum: "$items.price" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          totalRevenue: 1,
          totalQuantity: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    const totalRevenueValue = totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
    const monthlyEarningsValue = monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;

    const newUsers = await User.find({ is_blocked: 1, isAdmin: 0 })
      .sort({ date: -1 })
      .limit(5);

    // Get monthly data
    const monthlyDataArray = await getMonthlyDataArray();

    // Get daily data
    const dailyDataArray = await getDailyDataArray();

    // Get yearly data
    const yearlyDataArray = await getYearlyDataArray();

    const weeklyDataArray = await getWeeklyDataArray();

    const monthlyOrderCounts = monthlyDataArray.map((item) => item.count);
    const dailyOrderCounts = dailyDataArray.map((item) => item.count);
    const yearlyOrderCounts = yearlyDataArray.map((item) => item.count);
    const weeklyOrderCounts = weeklyDataArray.map((item) => item.count);

    // Best Selling Product (top 10)
    const bestSellingProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.price" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          product: "$product.name",
          totalSales: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 },
    ]);

    // Best Selling Subcategories (top 10)

const bestSellingSubcategories = await Order.aggregate([
  { $match: { status: "delivered" } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: "$product.subcategories",
      totalRevenue: { $sum: "$items.price" },
      totalQuantity: { $sum: "$items.quantity" },
    },
  },
  {
    $lookup: {
      from: "subcategories",
      localField: "_id",
      foreignField: "_id",
      as: "subcategory",
    },
  },
  { $unwind: "$subcategory" },
  {
    $project: {
      _id: 0,
      subcategory: "$subcategory.name",
      totalRevenue: { $round: ["$totalRevenue", 2] },
      totalQuantity: 1,
    },
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 },
]);


    res.status(200).json({
      totalRevenue: totalRevenueValue,
      monthlyEarnings: monthlyEarningsValue,
      totalUsers,
      totalOrders,
      totalProducts,
      totalCategories,
      order,
      newUsers,
      monthlyOrderCounts,
      dailyOrderCounts,
      yearlyOrderCounts,
      weeklyOrderCounts,
      bestSellingProducts,
      bestSellingSubcategories,
      salesPerCategory,
      formatDate
    });
  } catch (err) {
    return next(new ErrorResponse(`Error fetching data: ${err.message}`, 500));
  }
});

module.exports ={ getAllAdminData}
