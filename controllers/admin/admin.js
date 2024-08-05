const User = require("../../models/users")
const Products = require("../../models/products")
const Category = require("../../models/category")
const Order = require("../../models/order")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate,formatDateISO } = require("../../utils/date")
const {
  getMonthlyDataArray,
  getDailyDataArray,
  getYearlyDataArray,
} = require("../../utils/chartDate");

const getCreateUser = asyncHandler(async (req, res, next) => {
  res.render(`./admin/createUser`)
})


const createUsers = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const users = await User.create(req.body)
  res.redirect("/admin/users")
})


const deleteUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findByIdAndDelete(req.params.id)
  if (!users) {
    return next(
      new ErrorResponse(`User not found wih the id of ${req.params.id}`, 404)
    )
  }
  res.status(201).json({
    success: true,
    data: {},
  })
})


const getUser = asyncHandler(async (req, res, next) => {
  const users = await User.findById(req.params.id)
  if (!users) {
    return next(
      new ErrorResponse(`User not found wih the id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: users,
  })
})


const getAdmin = asyncHandler(async (req, res, next) => {

  const PAGE_SIZE = 3// Number of transactions per page
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;
  const users = await User.find()
  let totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
  ]);

  const order = await Order.find().populate("user")
  const totalOrders = order.length;
  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);
  let totalRevenueValue = totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
  totalRevenue =(Math.round(totalRevenue * 100) / 100).toFixed(2);
  totalRevenueValue =(Math.round(totalRevenueValue * 100) / 100).toFixed(2);
  const products = await Products.find()
    .populate("category")
    .populate("subcategories")
    .exec()

  const paginatedOrders = order
    .sort((a, b) => b.date - a.date)
    .slice(skip, skip + PAGE_SIZE);
  res.render(`./admin/panel`, { users,order:paginatedOrders,formatDate, products,totalRevenue:totalRevenueValue ,currentPage: page,totalPages,PAGE_SIZE}
  )
})

const getAdminData = asyncHandler(async (req, res, next) => {
  try {
    let query = {};

    const products = await Products.find()
      .populate("category")
      .populate("subcategories")
      .exec()
    const users = await User.find()
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } }, // Include the conditions directly
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
          totalSales: { $sum: "$items.price" },
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
          totalSales: 1,
        },
      },
      { $sort: { totalSales: -1 } },
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

    const monthlyOrderCounts = monthlyDataArray.map((item) => item.count);
    const dailyOrderCounts = dailyDataArray.map((item) => item.count);
    const yearlyOrderCounts = yearlyDataArray.map((item) => item.count);


    res.json(
      {
        users,
        products,
        totalRevenue: totalRevenueValue,
        totalOrders,
        totalCategories,
        totalProducts,
        totalUsers,
        newUsers,
        order,
        monthlyEarningsValue,
        monthlyOrderCounts,
        dailyOrderCounts,
        yearlyOrderCounts,

      } )
  } catch (error) {
    console.log(error.message);
    // Handle errors appropriately
  }
})



///////////////////////////////////////////////////////

  const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.render(`./users/profile`, { user })
  })

const getEditInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.render(`./users/editInfo`, { user })
})


const loadUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
 console.log(`user is ${req.user}`.red) 
  const currentAdminEmail=req.user.email
  const userCount = await User.countDocuments()
  const blockCount = await User.countDocuments({status:false})
  res.render(`./admin/userList`, {userCount,blockCount, users,currentAdminEmail, name: "User List" })
})

const getEditUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id })
  res.render(`./admin/userEdit`, { user })
})
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

const updateUsers = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);

  // If user not found, return an error
  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id of ${userId}`, 404)
    );
  }

  // If a 'status' query parameter is provided, toggle the status
  if (req.query.status !== undefined) {
    user.status = !user.status;
  } else {
    // Otherwise, update user with the request body
    Object.assign(user, req.body);
  }

  // Save the updated user data and validate
  await user.save({ runValidators: true });

  // Respond with success and updated status
  res.json({ success: true, status: user.status });
});



const getSearchUsers = asyncHandler(async (req, res, next) => {
  let query = {}
  // if (req.query.search) {
    // }
  const users = await User.find({
    name: { $regex: req.query.search, $options: "i" },
  })
  const responseData = {
    users: users,
  }
  res.json(responseData)
})
//  @desc     Delete one user
//  @routes delete /users/:id
//  @access


module.exports = {
  loadUsers,
  getAdminData,
  createUsers,
  updateUsers,
  deleteUsers,
  getUser,
  getUsers,
  getEditInfo,
  getEditUsers,
  getAdmin,
  getCreateUser,
  getProfile,
  getSearchUsers,
}
