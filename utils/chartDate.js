const Order = require("../models/order"); // Import your Order model or adjust the path as needed

const getDailyDataArray = async () => {
  // Daily data
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  
  const dailyOrders = await Order.aggregate([
    {
      $match: {
        status: "delivered", // Ensure to use lowercase "delivered" as per the schema
        created_at: { $gte: sevenDaysAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$created_at" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dailyDataArray = [];
  for (let i = 6; i >= 0; i--) {
    const dayIndex = new Date(currentDate);
    dayIndex.setDate(currentDate.getDate() - i);
    const foundDay = dailyOrders.find(
      (order) => order._id === (dayIndex.getDay() === 0 ? 7 : dayIndex.getDay())
    );
    const count = foundDay ? foundDay.count : 0;
    const dayNameIndex = dayIndex.getDay() === 0 ? 6 : dayIndex.getDay() - 1;
    const dayName = dayNames[dayNameIndex];
    dailyDataArray.push({ day: dayName, count });
  }
  return dailyDataArray;
};

const getWeeklyDataArray = async () => {
  // Weekly data
  const currentDate = new Date();
  const fourWeeksAgo = new Date(currentDate);
  fourWeeksAgo.setDate(currentDate.getDate() - 28);
  
  const weeklyOrders = await Order.aggregate([
    {
      $match: {
        status: "delivered", // Ensure to use lowercase "delivered" as per the schema
        created_at: { $gte: fourWeeksAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: { $week: "$created_at" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const weeklyDataArray = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - (7 * i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekNumber = getWeekNumber(weekStart); // Assuming you have a getWeekNumber function defined
    const foundWeek = weeklyOrders.find((order) => order._id === weekNumber);
    const count = foundWeek ? foundWeek.count : 0;
    
    const weekRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    weeklyDataArray.push({ week: weekRange, count });
  }
  return weeklyDataArray;
};

const getMonthlyDataArray = async () => {
  // Monthly data
  const currentDate = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
  const monthlyOrders = await Order.aggregate([
    {
      $match: {
        status: "delivered", // Ensure to use lowercase "delivered" as per the schema
        created_at: { $gte: twelveMonthsAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: { $month: "$created_at" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyDataArray = [];
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentDate.getMonth() - i + 12) % 12;
    const foundMonth = monthlyOrders.find(
      (order) => order._id === monthIndex + 1
    );
    const count = foundMonth ? foundMonth.count : 0;
    const monthName = monthNames[monthIndex];
    monthlyDataArray.push({ month: monthName, count });
  }
  return monthlyDataArray;
};

const getYearlyDataArray = async () => {
  // Yearly data
  const currentDate = new Date();
  const sevenYearsAgo = new Date(currentDate);
  sevenYearsAgo.setFullYear(currentDate.getFullYear() - 7);
  
  const yearlyOrders = await Order.aggregate([
    {
      $match: {
        status: "delivered", // Ensure to use lowercase "delivered" as per the schema
        created_at: { $gte: sevenYearsAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: { $year: "$created_at" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const yearlyDataArray = [];
  for (let i = 6; i >= 0; i--) {
    const year = currentDate.getFullYear() - i;
    const foundYear = yearlyOrders.find((order) => order._id === year);
    const count = foundYear ? foundYear.count : 0;
    yearlyDataArray.push({ year, count });
  }
  return yearlyDataArray;
};

// Helper function to get the week number of a date
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

module.exports = { getMonthlyDataArray, getDailyDataArray, getWeeklyDataArray, getYearlyDataArray };
