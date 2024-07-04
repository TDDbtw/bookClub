
// Helper function to fetch data from checkout form
function getCheckoutFormData() {
  const items = []; // Replace with logic to get items from your checkout form
  const totalAmount = document.querySelector('[name=total_amount]').value; // Adjust based on your form structure
  // Example: Assuming you have a list of items in your form
  const itemElements = document.getElementById('CART').value;
  itemElements.forEach(item => {
    const id = item.productId;
    const quantity = item.quantity;
    const name= item.name
    items.push({ id, quantity });
  });

  return { items, totalAmount };
}

// PayPal SDK URL and client ID
const paypalSdkUrl = "https://www.paypal.com/sdk/js";
const clientId = document.getElementById('ID').value; // Replace with your actual client ID
const currency = "USD";
const intent = "capture";
const alerts = document.getElementById("alerts");

// Function to dynamically load PayPal SDK
function loadPayPalSDK() {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script');
    script.src = `${paypalSdkUrl}?client-id=${clientId}&currency=${currency}&intent=${intent}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Wait for PayPal SDK to load
loadPayPalSDK().then(() => {
  // PayPal Buttons configuration
  const paypalButtons = paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'paypal'
    },

    // Function to create PayPal order
    createOrder: function(data, actions) {
      const { items, totalAmount } = getCheckoutFormData();

      return fetch("/order/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          items,
          totalAmount,
          intent
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create PayPal order');
        }
        return response.json();
      })
      .then(order => order.id)
      .catch(error => {
        console.error('Error creating PayPal order:', error);
        alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p></div>`;
      });
    },

    // Function executed when payment is approved
    onApprove: function(data, actions) {
      const order_id = data.orderID;

      return fetch("/order/capture-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          intent,
          order_id
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to capture payment');
        }
        return response.json();
      })
      .then(order_details => {
        // Display success message or handle successful payment
        alerts.innerHTML = `<div class=\'ms-alert ms-action\'>Thank you ${order_details.payer.name.given_name} ${order_details.payer.name.surname} for your payment of ${order_details.purchase_units[0].payments.captures[0].amount.value} ${order_details.purchase_units[0].payments.captures[0].amount.currency_code}!</div>`;
      })
      .catch(error => {
        console.error('Error capturing payment:', error);
        alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p></div>`;
      });
    },

    // Function executed when payment is cancelled
    onCancel: function(data) {
      alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p></div>`;
    },

    // Function executed on error
    onError: function(err) {
      console.error('PayPal Error:', err);
      alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p></div>`;
    }
  });

  // Render PayPal buttons
  paypalButtons.render('#paypal-button-container');
})
.catch(error => {
  console.error('Failed to load PayPal SDK:', error);
  alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p></div>`;
});
