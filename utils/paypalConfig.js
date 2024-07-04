const paypal = require("paypal-rest-sdk")
const asyncHandler = require("../middleware/async")
paypal.configure({
  mode: "sandbox", // Use 'sandbox' for testing, 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
})


const getAccessToken  = asyncHandler(async (req, res, next) => {
  
    const auth = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    const data = 'grant_type=client_credentials'
    return await fetch(process.env.base + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
console.log(`paypal token is ${json.access_token}`)
            return json.access_token;
            // res.json( json.access_token)
        })
})

const createOrder = async (amount) => {
  const accessToken = await getAccessToken();
  const orderData = {
    'intent': 'CAPTURE',
    'purchase_units': [{
      'amount': {
        'currency_code': 'USD',
        'value': amount
      }
    }]
  };

  const response = await fetch(`${process.env.base}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(orderData)
  });

  const json = await response.json();
  return json;
};

const captureOrder = async (orderID) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.base}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const json = await response.json();
  return json;
};

module.exports={
createOrder,
captureOrder,
getAccessToken,
paypal
}
