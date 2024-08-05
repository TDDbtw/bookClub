const Order = require("../models/order");
const moment = require("moment");

const getDailyDataArray = async () => {
    const currentDate = new Date();
    const sevenDaysAgo = moment(currentDate).subtract(6, 'days').startOf('day').toDate();

    const dailyOrders = await Order.aggregate([
        {
            $match: {
                status: "delivered",  // Assuming the status is on the order level, not item level
                created_at: { $gte: sevenDaysAgo, $lte: currentDate },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    const dailyDataArray = [];
    for (let i = 6; i >= 0; i--) {
        const day = moment(currentDate).subtract(i, 'days');
        const dayString = day.format('YYYY-MM-DD');
        const foundDay = dailyOrders.find(order => order._id === dayString);
        const count = foundDay ? foundDay.count : 0;
        dailyDataArray.push({ day: day.format('dddd'), count });
    }

    return dailyDataArray;
};


const getMonthlyDataArray = async () => {
    const currentDate = new Date();
    const twelveMonthsAgo = moment(currentDate).subtract(12, 'months').toDate();
    const monthlyOrders = await Order.aggregate([
        {
            $match: {
                status: "delivered",
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
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const monthlyDataArray = [];
    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        const foundMonth = monthlyOrders.find(order => order._id === monthIndex + 1);
        const count = foundMonth ? foundMonth.count : 0;
        monthlyDataArray.push({ month: monthNames[monthIndex], count });
    }
    return monthlyDataArray;
};

const getYearlyDataArray = async () => {
    const currentDate = new Date();
    const sevenYearsAgo = moment(currentDate).subtract(7, 'years').toDate();
    const yearlyOrders = await Order.aggregate([
        {
            $match: {
                status: "delivered",
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
        const foundYear = yearlyOrders.find(order => order._id === year);
        const count = foundYear ? foundYear.count : 0;
        yearlyDataArray.push({ year, count });
    }
    return yearlyDataArray;
};
const getWeeklyDataArray = async () => {
    const currentDate = new Date();
    const sevenWeeksAgo = moment(currentDate).subtract(7, 'weeks').startOf('week').toDate();
    
    const weeklyOrders = await Order.aggregate([
        {
            $match: {
                status: "delivered",
                created_at: { $gte: sevenWeeksAgo, $lte: currentDate },
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
for (let i = 6; i >= 0; i--) {
    const weekStart = moment(currentDate).subtract(i, 'weeks').startOf('week');
    const weekEnd = moment(weekStart).endOf('week');
    const weekNumber = weekStart.week();

    const foundWeek = weeklyOrders.find(order => order._id === weekNumber);
    const count = foundWeek ? foundWeek.count : 0;

    weeklyDataArray.push({
        weekRange: `${weekStart.format('dddd')} - ${weekEnd.format('dddd')}`,
        count
    });
}
console.log(`${JSON.stringify(weeklyDataArray)}`.yellow)
    return weeklyDataArray;
};


const getCustomDateRangeData = async (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(`Start Date: ${start}`);
    console.log(`End Date: ${end}`);

    const salesData = await Order.aggregate([
        {
            $match: {
                created_at: { $gte: start, $lte: end },
                status: "delivered"
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                count: { $sum: 1 },
                total: { $sum: "$totalAmount" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    console.log(`Sales Data: ${JSON.stringify(salesData)}`.yellow);

    const customDateArray = salesData.map(data => ({
        date: data._id,
        count: data.count,
        total: data.total
    }));

    console.log(`${JSON.stringify(customDateArray)}`.yellow);
    return customDateArray;
};

// Example usage
getCustomDateRangeData('2024-07-24', '2024-07-31');
module.exports = {getCustomDateRangeData,  getWeeklyDataArray, getMonthlyDataArray, getDailyDataArray, getYearlyDataArray };
