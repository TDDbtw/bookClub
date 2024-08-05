const Order = require('../models/order');
const Product = require('../models/products');
const Category = require('../models/category');


const getTopSellingProducts = async (limit = 10) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.name" },
          numberOfOrders: { $sum: 1 },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          product: "$productName",
          numberOfOrders: 1,
          quantitySold: 1,
          revenue: 1
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit }
    ]);
    return topProducts;
  } catch (error) {
    console.error('Error in getTopSellingProducts:', error);
    throw error;
  }
};

const getTopSellingCategories = async (limit = 10) => {
  try {
    const topCategories = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          category: { $first: "$category.name" },
          numberOfOrders: { $sum: 1 },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          category: 1,
          numberOfOrders: 1,
          quantitySold: 1,
          revenue: 1
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit }
    ]);
    return topCategories;
  } catch (error) {
    console.error('Error in getTopSellingCategories:', error);
    throw error;
  }
};
const getTopSellingSubcategories = async (limit = 10) => {
  try {
    const topSubcategories = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "subcategories",
          localField: "product.subcategories",
          foreignField: "_id",
          as: "subcategory"
        }
      },
      { $unwind: "$subcategory" },
      {
        $group: {
          _id: "$subcategory._id",
          subcategory: { $first: "$subcategory.name" },
          numberOfOrders: { $sum: 1 },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          subcategory: 1,
          numberOfOrders: 1,
          quantitySold: 1,
          revenue: 1
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit }
    ]);
console.log(`${JSON.stringify(topSubcategories)}`)
    return topSubcategories;
  } catch (error) {
    console.error('Error in getTopSellingSubcategories:', error);
    throw error;
  }
};


module.exports = {
  getTopSellingProducts,
  getTopSellingCategories,
  getTopSellingSubcategories
};
