const cartTableBody = document.querySelector('.cart-table tbody');
const subtotalElement = document.querySelector('.summary .price');
const taxElement = document.querySelector('.summary li:nth-child(2) .price');
const grandTotalElement = document.querySelector('.summary .total-price .price');
const emptyCartMessage = document.querySelector('.cart-content');

async function fetchAndDisplayCart() {
  try {
    const response = await axios.get('/cart/list');
    const cartData = response.data;

    if (cartData && cartData.items.length > 0) {
      cartTableBody.innerHTML = '';

      cartData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="product-info">
              <a class='productRef' href="/products/${item.productId}">
                <img src="${item.image[0]}" alt="${item.name}" width="50" height="70">
              </a>
              <a class='productRef' href="/products/${item.productId}">
                <span>${item.name}</span>
              </a>
            </div>
          </td>
          <td>
            <span class="current-price">$${item.discountedPrice.toFixed(2)}</span>
            ${item.price !== item.discountedPrice 
              ? `<span class="original-price">$${item.price.toFixed(2)}</span>`
              : ''}
          </td>
          <td>
            <div class="quantity-controls">
              <button class="decrement decrement-button" data-product-id="${item.productId}">-</button>
              <input type="number" value="${item.quantity}" min="1" max="10" data-product-id="${item.productId}" class="update-quantity-input">
              <button class="increment increment-button" data-product-id="${item.productId}">+</button>
            </div>
          </td>
          <td>$${(item.discountedPrice * item.quantity).toFixed(2)}</td>
          <td>
            <button type="button" data-product-id="${item.productId}" class="remove-btn">Remove</button>
          </td>
        `;
        cartTableBody.appendChild(row);
      });

      updateCartTotal(cartData);
      addEventListenersToCartButtons();

    } else {
      emptyCartMessage.innerHTML = '<p>Your cart is empty.</p>';
    }

  } catch (error) {
    console.error('Error fetching cart:', error);
    alert('An error occurred while loading your cart. Please try again later.');
  }
}


function updateCartTotal(cartData) {
  subtotalElement.textContent = `$${cartData.billTotal.toFixed(2)}`;
  const tax = cartData.billTotal * 0.05;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  const grandTotal = cartData.billTotal + tax;
  grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
}

function addEventListenersToCartButtons() {
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });

  document.querySelectorAll('.update-quantity-input').forEach(input => {
    input.addEventListener('change', handleUpdateQuantity);
  });

  document.querySelectorAll('.decrement-button').forEach(button => {
    button.addEventListener('click', handleDecrementQuantity);
  });

  document.querySelectorAll('.increment-button').forEach(button => {
    button.addEventListener('click', handleIncrementQuantity);
  });
}

async function handleRemoveItem(event) {
  const productId = event.target.dataset.productId;
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      if (response.status === 200) {
        event.target.closest('tr').remove();
        Swal.fire('Deleted!', 'Your item has been removed from the cart.', 'success');
        updateCartTotal(response.data);
      } else {
        console.error('Failed to remove item:', response.status);
        alert('Failed to remove item from cart.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      location.reload();
    }
  }
}


async function handleUpdateQuantity(event) {
  const productId = event.target.dataset.productId;
  const newQuantity = parseInt(event.target.value);

  try {
    const response = await axios.put(`/cart/update/${productId}`, { quantity: newQuantity });
    if (response.status === 200) {
      const updatedCart = response.data;
      const updatedItem = updatedCart.items.find(item => item.productId === productId);

      console.log(`updated carted item${JSON.stringify(updatedCart)}`);
      
      const row = event.target.closest('tr');
      const priceCell = row.querySelector('td:nth-child(2)');
      // priceCell.innerHTML = `
      //   ${updatedItem.price !== updatedItem.productPrice 
      //     ? `<span class="original-price">$${updatedItem.price.toFixed(2)}</span>`
      //     : ''}
      //   <span class="current-price">$${updatedItem.productPrice.toFixed(2)}</span>
      // `;
      row.querySelector('td:nth-child(4)').textContent = `$${(updatedItem.productPrice * updatedItem.quantity).toFixed(2)}`;
      
      updateCartTotal(updatedCart);

    } else {
      console.error('Failed to update quantity:', response.status);
      alert('Failed to update quantity.');
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    window.toast.error(error);
  }
}

function handleDecrementQuantity(event) {
  const input = event.target.nextElementSibling;
  const newQuantity = Math.max(1, parseInt(input.value) - 1);
  input.value = newQuantity;
  handleUpdateQuantity({ target: input });
}

function handleIncrementQuantity(event) {
  const input = event.target.previousElementSibling;
  const newQuantity = Math.min(10, parseInt(input.value) + 1);
  input.value = newQuantity;
  handleUpdateQuantity({ target: input });
}

fetchAndDisplayCart();
