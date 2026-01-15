const mongoose = require('mongoose');
const Order = require('../models/order');
const moment = require('moment');

async function getSalesReportData(startDate, endDate, filter) {
  console.log(`Filter: ${filter}`);
  console.log(`Start Date: ${startDate}`);
  console.log(`End Date: ${endDate}`);

  let dateFilter = {};

  if (filter === 'daily') {
    dateFilter = {
      $gte: moment().startOf('day').toDate(),
      $lt: moment().endOf('day').toDate(),
    };
  } else if (filter === 'weekly') {
    dateFilter = {
      $gte: moment().startOf('isoWeek').toDate(),
      $lt: moment().endOf('isoWeek').toDate(),
    };
  } else if (filter === 'monthly') {
    dateFilter = {
      $gte: moment().startOf('month').toDate(),
      $lt: moment().endOf('month').toDate(),
    };
  } else if (filter === 'yearly') {
    dateFilter = {
      $gte: moment().startOf('year').toDate(),
      $lt: moment().endOf('year').toDate(),
    };
  } else if (filter === 'custom') {
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }
  }

  const pipeline = [
    { $match: { created_at: dateFilter } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSales: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "delivered"] },
                  {
                    $or: [
                      { $eq: [{ $ifNull: ["$items.request.status", null] }, null] },
                      { $ne: ["$items.request.status", "accepted"] }
                    ]
                  }
                ]
              },
              '$items.quantity',
              0
            ]
          }
        },
        totalRevenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "delivered"] },
                  {
                    $or: [
                      { $eq: [{ $ifNull: ["$items.request.status", null] }, null] },
                      { $ne: ["$items.request.status", "accepted"] }
                    ]
                  }
                ]
              },
              { $multiply: ['$items.quantity', '$items.price'] },
              0
            ]
          }
        },
        totalDiscount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "delivered"] },
                  {
                    $or: [
                      { $eq: [{ $ifNull: ["$items.request.status", null] }, null] },
                      { $ne: ["$items.request.status", "accepted"] }
                    ]
                  }
                ]
              },
              {
                $add: [
                  { $ifNull: [{ $sum: '$coupons.discount' }, 0] },
                  { $ifNull: [{ $sum: '$items.offers.discountValue' }, 0] }
                ]
              },
              0
            ]
          }
        },
        returnedRevenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$items.request.type", "return"] },
                  { $eq: ["$items.request.status", "accepted"] }
                ]
              },
              { $multiply: ['$items.quantity', '$items.price'] },
              0
            ]
          }
        },
        cancelledOrders: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        cancelledQuantity: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, '$items.quantity', 0] } },
        returnedOrders: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$items.request.type", "return"] },
                  { $eq: ["$items.request.status", "accepted"] }
                ]
              },
              1,
              0
            ]
          }
        },
        returnedQuantity: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$items.request.type", "return"] },
                  { $eq: ["$items.request.status", "accepted"] }
                ]
              },
              '$items.quantity',
              0
            ]
          }
        },
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
      $addFields: {
        netRevenue: { $subtract: ['$totalRevenue', '$totalDiscount'] },
      },
    },
    {
      $project: {
        _id: 1,
        totalSales: 1,
        totalRevenue: 1,
        totalDiscount: 1,
        netRevenue: 1,
        returnedRevenue: 1,
        cancelledOrders: 1,
        cancelledQuantity: 1,
        returnedOrders: 1,
        returnedQuantity: 1,
        'productDetails.name': 1,
        'productDetails.offer': 1,
      },
    },
  ];
  try {
    const result = await Order.aggregate(pipeline);
    console.log('Sales Report Data:', result);
    return result;
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw error;
  }
}

module.exports = { getSalesReportData };
