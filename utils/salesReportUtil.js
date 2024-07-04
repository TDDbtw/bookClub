// salesReportService.js
const Order = require('../models/order');

async function getSalesReportData(filter, startDate, endDate) {
  const dateFilter = {};

  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }
  if (endDate) {
    dateFilter.$lte = new Date(endDate);
  }

  const pipeline = [
    { $match: dateFilter.created_at ? { created_at: dateFilter } : {} },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSales: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        totalDiscount: { $sum: { $ifNull: ['$items.discount', 0] } },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'product',
        as: 'offerDetails',
      },
    },
    {
      $lookup: {
        from: 'coupons',
        localField: '_id',
        foreignField: 'claimedBy',
        as: 'couponDetails',
      },
    },
    {
      $addFields: {
        netRevenue: { $subtract: ['$totalRevenue', '$totalDiscount'] },
      },
    },
  ];

  return Order.aggregate(pipeline).exec();
}

module.exports = { getSalesReportData };
