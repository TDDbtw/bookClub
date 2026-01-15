const Wallet = require("../../models/wallet")
const User = require("../../models/users")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const { formatDate } = require("../../utils/date")
const colors = require("colors")
const paypal = require('@paypal/checkout-server-sdk')


const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
)
let client = new paypal.core.PayPalHttpClient(environment);

const getWallet = asyncHandler(async (req, res, next) => {
  const ID = process.env.PAYPAL_CLIENT_ID;
  const PAGE_SIZE = 4; // Number of transactions per page
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const user = await User.findById(req.user.id);
  const wallet = await Wallet.findOrCreate(user.id);

  const totalTransactions = wallet.transactions.length;
  const totalPages = Math.ceil(totalTransactions / PAGE_SIZE);

  // Sort transactions by date (most recent first) and paginate
  const paginatedTransactions = wallet.transactions
    .sort((a, b) => b.date - a.date)
    .slice(skip, skip + PAGE_SIZE);

  res.render(`./users/wallet`, {
    wallet: {
      ...wallet.toObject(),
      transactions: paginatedTransactions
    },
    ID,
    currentPage: page,
    totalPages,
    PAGE_SIZE
  });
});


const addTransaction = asyncHandler(async (req, res, next) => {
  try {
    const { type, amount, description } = req.body;
    const userId = req.user._id;

    const wallet = await Wallet.findOrCreate(userId);
    wallet.addTransaction(type, amount, description);
    await wallet.save();

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
})

const addToWallet = asyncHandler(async (req, res, next) => {
  const { type, amount, description } = req.body;
  const userId = req.user._id;
  const wallet = await Wallet.findOrCreate(userId);
  wallet.addTransaction(type, amount, description);
  await wallet.save();
  res.json(wallet);
})

const handlePayPalPayment = asyncHandler(async (req, res, next) => {

  const { orderID } = req.body;
  const userId = req.user._id;



  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);

    const captureID = capture.result.purchase_units[0].payments.captures[0].id;
    const amount = parseFloat(capture.result.purchase_units[0].payments.captures[0].amount.value);
    const wallet = await Wallet.findOrCreate(userId);
    wallet.addTransaction('credit', amount, `PayPal payment: ${captureID}`);
    await wallet.save();

    res.json({ success: true, wallet });
  } catch (error) {
    console.error(`Error capturing payment: ${error}`.red);
    return next(new ErrorResponse('Error processing payment', 500));
  }
})

const createPayPalOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return next(new ErrorResponse('Invalid amount', 400));
  }



  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toString()
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error(`Error creating PayPal order: ${error}`.red);
    return next(new ErrorResponse('Error creating order', 500));
  }
})

module.exports = {
  getWallet,
  addToWallet,
  handlePayPalPayment,
  createPayPalOrder,
  addTransaction,
}
