const paymentMethodSelect = document.getElementById('payment_method');

if(paymentMethodSelect.value= "Select a payment method"){
  document.getElementById("placeOrderBtn").disabled = true;
  document.getElementById("paymentError").innerHTML = "Please select a Payment option";
}
document.addEventListener('DOMContentLoaded', () => {
  const codDetails = document.getElementById('cod_details');
  const razorpayDetails = document.getElementById('razorpay_details');
  const paypalDetails = document.getElementById('paypal_details');

  // Initialize payment method select
  paymentMethodSelect.addEventListener('change', () => {
    const paymentMethod = paymentMethodSelect.value;

    // Hide all payment details sections
    codDetails.style.display = 'none';
    razorpayDetails.style.display = 'none';
    paypalDetails.style.display = 'none';

    // Display the selected payment details section
    if (paymentMethod === 'cod') {
      codDetails.style.display = 'block';
    } else if (paymentMethod === 'razorpay') {
      razorpayDetails.style.display = 'block';
    } else if (paymentMethod === 'paypal') {
      paypalDetails.style.display = 'block';
    }
  });

  if(paymentMethodSelect.value!= "Select a payment method"){
  document.getElementById("placeOrderBtn").disabled = false ;
  document.getElementById("paymentError").style.color = "red";
  document.getElementById("paymentError").innerHTML = "";

  }

  const checkoutForm = document.querySelector('.checkoutForm');

  document.getElementById('placeOrderBtn').addEventListener('click', async (event) => {
    event.preventDefault();

    const paymentMethod = paymentMethodSelect.value;
    const user = document.querySelector('[name=user]').value;
    const cart = document.querySelector('[name=cart]').value;
    const totalAmount = document.querySelector('[name=total_amount]').value;

    // Display confirmation dialog using SweetAlert
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
          const response = await axios.post('/order/', {
            payment_method: paymentMethod,
            user: user,
            cart: cart,
            total_amount: totalAmount
          });

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
  });
});

// Check if there are shipping addresses
const user =document.getElementById('userInput')
if (user.addresses && user.addresses.length > 0) {
  const addressSelection = document.querySelector('.address-selection');
  // Add event listeners to each radio button
  user.addresses.forEach((address, index) => {
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'shipping_address';
    radioButton.id = `address-${index}`;
    radioButton.value = address._id;
    // Check if this address is the default shipping address
    if (user.shipping_address && user.shipping_address._id === address._id) {
      radioButton.checked = true; // Mark as selected
    }
    radioButton.addEventListener('change', () => {
      // Send a POST request to set the shipping address
      axios.post('/user/set-shipping-address', { addressId: address._id })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    });

    const label = document.createElement('label');
    label.htmlFor = `address-${index}`;
    label.textContent = `${address.address}, ${address.city}, ${address.state}, ${address.zip_code}, ${address.country}`;

    const addressItem = document.createElement('div');
    addressItem.classList.add('address-item');
    addressItem.appendChild(radioButton);
    addressItem.appendChild(label);

    addressSelection.appendChild(addressItem);
  });
}
