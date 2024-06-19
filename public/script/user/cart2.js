// public/scripts/user/cart.js

console.log("cart running")
async function updateQuantity(event, action, productId) {
  event.preventDefault();
  try {
    const response = await fetch(`/cart/update/${productId}?quantity=${action}`, {
      method: 'PATCH',
    });
    if (response.ok) {
      const data = await response.json();
      // Update the UI based on the response data
      const quantitySpan = document.querySelector(`button[data-id='${productId}']`).nextElementSibling;
      quantitySpan.innerText = data.newQuantity;
      document.getElementById('cart-subtotal').innerText = data.billTotal.toFixed(2);
      document.getElementById('cart-tax').innerText = (0.05 * data.billTotal).toFixed(2);
      document.getElementById('cart-total').innerText = ((data.billTotal) + (0.05 * data.billTotal)).toFixed(2);
    } else {
      console.error('Failed to update quantity');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function removeFromCart(event, productId) {
  event.preventDefault();
  try {
    const response = await fetch(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      document.querySelector(`button[data-id='${productId}']`).closest('tr').remove();
      const data = await response.json();
      // Update the totals
      document.getElementById('cart-subtotal').innerText = data.billTotal.toFixed(2);
      document.getElementById('cart-tax').innerText = (0.05 * data.billTotal).toFixed(2);
      document.getElementById('cart-total').innerText = ((data.billTotal) + (0.05 * data.billTotal)).toFixed(2);
    } else {
      console.error('Failed to remove item');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

