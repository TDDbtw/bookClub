console.log(`coupon result is ${couponResult.discountAmount}`);
const ID = document.getElementById('ID').value;
const paymentMethodSelect = document.getElementById('payment_method');
const cart = document.querySelector('[name=cart]').value;
const totalAmount = document.querySelector('[name=total_amount]').value;
let user = document.getElementById('userInput').value;
let paymentMethod = paymentMethodSelect.value;
if (document.getElementById('payment_method').value == "") {
  document.getElementById('placeOrderBtn').disabled = true;
  document.getElementById("paymentError").innerHTML = "Please select a Payment option";
}

document.addEventListener('DOMContentLoaded', () => {
  const codDetails = document.getElementById('cod_details');
  const razorpayDetails = document.getElementById('razorpay_details');
  const paypalDetails = document.getElementById('paypal_details');

  paymentMethodSelect.addEventListener('change', () => {
    const paymentMethod = paymentMethodSelect.value;

    codDetails.style.display = 'none';
    razorpayDetails.style.display = 'none';
    paypalDetails.style.display = 'none';

    if (paymentMethod === 'cod') {
      codDetails.style.display = 'block';
    } else if (paymentMethod === 'razorpay') {
      razorpayDetails.style.display = 'block';
    } else if (paymentMethod === 'paypal') {
      paypalDetails.style.display = 'block';
    }

    if (document.getElementById('payment_method').value != "") {
      document.getElementById('placeOrderBtn').disabled = false;
      document.getElementById("paymentError").innerHTML = '';
    }
  });


  document.getElementById('placeOrderBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    paymentMethod = paymentMethodSelect.value
    console.log(`mthode is ${paymentMethod}`.yellow)
    placeOrder()

  });
});
function placeOrder(){
  const orderDetails={
    payment_method: paymentMethod,
    user: user,
    cart: cart,
    total_amount: totalAmount,
    coupon: couponResult

  }
  if(paymentMethod=='cod'){

    // COD payment
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
  if(paymentMethod=='razorpay'){

    // Razor payment

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
            currency: "USD",
            name: "bookClub",
            description: "Payment for Your Order",
            order_id: data.order.id,
            handler: async function (response) {
              // Handle successful payment response here
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
                    // Redirect to order confirmation page or any other desired action
                    window.location.href = "/user/order";
                  } else {
                    // Handle error in order creation
                    console.error("Error in order creation:", orderData.error);
                  }
                } catch (error) {
                  console.error("Error in order creation:", error);
                }
              }
            },
            prefill: {
              name: "bookClub",
              email: "bookClub.com",
              contact: "9744266925 "
            },
            notes: {
              address: "Razorpay Corporate Office"
            },
            theme: {
              color: "#081c15"
            }
          };

          const razer = new Razorpay(options);
          razer.open();
        } else {
          // Handle error in Razorpay order creation
          console.error("Error in Razorpay order creation:", data.error);
        }
      })
      .catch(error => {
        console.error("Error in making the request:", error);
      });


  }
}
