console.log(`coupon result is ${couponResult.discountAmount}`);
const radios = document.querySelectorAll('input[name="payment-inline"]');
const ID = document.getElementById('ID').value;
const cart = document.querySelector('[name=cart]').value;
const totalAmount = document.querySelector('[name=total_amount]').value;
let user = document.getElementById('userInput').value;
let selectedPayment = '';
let paymentMethod = '';
if (paymentMethod === "" ) {
  document.getElementById('placeOrderBtn').disabled = true;
  document.getElementById("paymentError").innerHTML = "Please select a Payment option";
}
if (!JSON.parse(user).billing_address|| !JSON.parse(user).shipping_address) {

  document.getElementById('placeOrderBtn').disabled = true;
  document.getElementById("addressError").innerHTML = "Add / Select Shipping && Billing Address";
}

document.addEventListener('DOMContentLoaded', () => {
  const codDetails = document.getElementById('cod_details');
  const razorpayDetails = document.getElementById('razorpay_details');
  const walletDetails = document.getElementById('wallet_details');
  let selectedValue;

  radios.forEach((radio) => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });

  document.querySelectorAll('input[name="payment-inline"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      paymentMethod = this.value;

      codDetails.style.display = 'none';
      razorpayDetails.style.display = 'none';
      walletDetails.style.display = 'none';

      if (paymentMethod === 'cod') {
        codDetails.style.display = 'block';
      } else if (paymentMethod === 'razorpay') {
        razorpayDetails.style.display = 'block';
      } else if (paymentMethod === 'wallet') {
        walletDetails.style.display = 'block';
      }

      if (this.value !== "") {
        document.getElementById('placeOrderBtn').disabled = false;
        document.getElementById("paymentError").innerHTML = '';
      }
      else{
        document.getElementById('placeOrderBtn').disabled = true;
    }
    });
  });

  document.getElementById('placeOrderBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(`method is ${paymentMethod}`)
    placeOrder()
  });
});

function placeOrder() {
  const orderDetails = {
    payment_method: paymentMethod,
    user: user,
    cart: cart,
    total_amount: totalAmount,
    coupon: couponResult
  };

  if (paymentMethod === 'cod' || paymentMethod === 'wallet') {
    // COD or Wallet payment
    Swal.fire({
      title: 'Confirm Order',
      text: 'Are you sure you want to place the order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Place Order',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post('/order', orderDetails);
          if (response.data.success) {
            Swal.fire({
              title: 'Order Placed!',
              text: 'Your order has been successfully placed.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.href = '/order';
            });
          } else {
            Swal.fire({
              title: 'Order Failed',
              text: 'Failed to place the order. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          console.error('Error:', error.message);
          Swal.fire({
            title: 'Order Failed',
            text: 'Failed to place the order. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }

  if (paymentMethod === 'razorpay') {
    // Razorpay payment
    axios.post('/order/razorpayOrder', orderDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        const data = response.data;
        if (data.success) {
          const options = {
            key: ID,
            amount: data.order.amount,
            // currency: "USD",
            currency: "INR",
            name: "bookClub",
            description: "Payment for Your Order",
            order_id: data.order.id,
            handler: async function (response) {
              if (response.razorpay_payment_id) {
                try {
                  const createOrderResponse = await axios.post("/order", 
                    { ...orderDetails, amount: (options.amount) / 100 }, 
                    {
                      headers: {
                        "Content-Type": "application/json",
                      }
                    }
                  );

                  const orderData = createOrderResponse.data;
                  if (orderData.success) {
                    window.location.href = "/user/order";
                  } else {
                    console.error("Error in order creation:", orderData.error);
                  }
                } catch (error) {
                  console.error("Error in order creation:", error);
                }
              }
            },
            prefill: {
              name: "bookClub",
              email: "bookClub@gmail.com",
              contact: "9744266925"
            },
            notes: {
              address: "Razorpay Corporate Office"
            },
            theme: {
              color: "#081c15"
            },
            modal: {
              ondismiss: function () {
                handleRazorpayFailure(orderDetails);
              }
            }
          };

          const razer = new Razorpay(options);
          razer.open();
        } else {
          console.error("Error in Razorpay order creation:", data.error);
        }
      })
      .catch(error => {
        console.error("Error in making the request:", error);
      });
  }
}

function handleRazorpayFailure(orderDetails) {
  window.toast.errorMessage('error');
  axios.post('/order/failed', orderDetails, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.data.success==false) {
        Swal.fire({
          title: 'Payment Failed',
          text: 'Your payment failed. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
              window.location.href = '/order';
      } else {
        console.error("Error in handling failed order:", response.data.error);
      }
    })
    .catch(error => {
      console.error("Error in handling failed order:", error);
    });
}

if (totalAmount > 200) {
  const codOption = document.querySelector('input[value=cod]');
  codOption.setAttribute('disabled', '')
  const codMsg = document.getElementById('codMsg')
  codOption.style.color = 'grey'
  codMsg.innerHTML = '(not available for orders above 200)'
  codMsg.style.color = 'grey'
}

function getSelectedPaymentMethod() {
  const radios = document.querySelectorAll('input[name="payment-inline"]');
  let selectedValue;
  radios.forEach((radio) => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });
}
