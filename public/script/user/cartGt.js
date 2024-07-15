const cartTableBody = document.querySelector('.cart-table tbody');
const subtotalElement = document.querySelector('.summary .price'); // Subtotal element
const taxElement = document.querySelector('.summary li:nth-child(2) .price'); // Tax element
const grandTotalElement = document.querySelector('.summary .total-price .price'); // Grand total element
const emptyCartMessage = document.querySelector('.cart-content'); // Select the cart content container

// Function to fetch and display cart data
async function fetchAndDisplayCart() {
  try {
    const response = await axios.get('/cart/list'); // Adjust route if needed
    const cart = response.data;

    if (cart && cart.items.length > 0) {
      // Populate the cart table
      cartTableBody.innerHTML = ''; // Clear any existing items

      cart.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="product-info">
              <a class='productRef' href="/products/${item.productId}">
              <img src="${item.image}" alt="${item.name}" width="50" height="70">
          </a>
              <a class='productRef' href="/products/${item.productId}">
              <span>${item.name}</span>
          </a>
            </div>
          </td>
          <td>$${item.productPrice.toFixed(2)}</td>
          <td>
            <div class="quantity-controls">
              <button class="decrement decrement-button" data-product-id="${item.productId}">-</button>
              <input type="number" value="${item.quantity}" min="1" data-product-id="${item.productId}" class="update-quantity-input">
              <button class="increment increment-button" data-product-id="${item.productId}">+</button>
            </div>
          </td>
          <td>$${(item.productPrice * item.quantity).toFixed(2)}</td>
          <td>
            <button type="button" data-product-id="${item.productId}" class="remove-btn">Remove</button>
          </td>
        `;
        cartTableBody.appendChild(row);
      });

      // Update cart total
      updateCartTotal(cart);

      // Add event listeners to buttons
      addEventListenersToCartButtons();

    } else {
      // Show the "empty cart" message
      emptyCartMessage.innerHTML = '<p>Your cart is empty.</p>';
    }

  } catch (error) {
    console.error('Error fetching cart:', error);
    alert('An error occurred while loading your cart. Please try again later.');
  }
}

// Function to update the cart total on the page
function updateCartTotal(cart) {
console.log(`${JSON.stringify(cart.items)}`)
  const subtotal = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  const tax = subtotal * 0.05; // Assuming a 5% tax rate
  const grandTotal = subtotal + tax;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;

}

// Function to add event listeners to cart buttons
function addEventListenersToCartButtons() {
  const removeButtons = document.querySelectorAll('.remove-btn');
  const updateQuantityInputs = document.querySelectorAll('.update-quantity-input');
  const decrementButtons = document.querySelectorAll('.decrement-button');
  const incrementButtons = document.querySelectorAll('.increment-button');

  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });

  updateQuantityInputs.forEach(input => {
    input.addEventListener('change', handleUpdateQuantity); 
  });

  decrementButtons.forEach(button => {
    button.addEventListener('click', handleDecrementQuantity);
  });

  incrementButtons.forEach(button => {
    button.addEventListener('click', handleIncrementQuantity);
  });
}

// Function to handle item removal
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
    const response = await axios.delete(`/cart/remove/${productId}`); // Adjust route if needed
    
    console.log(`${response.data}`)  
    if (response.status === 200) {
      event.target.closest('tr').remove();

        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      updateCartTotal(response.data); // Assuming the response includes the updated cart
    } else {
      console.error('Failed to remove item:', response.status);
      alert('Failed to remove item from cart.');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    location.reload();
  }
}}

// Function to handle quantity updates
async function handleUpdateQuantity(event) {
  const productId = event.target.dataset.productId;
  const newQuantity = parseInt(event.target.value); 

  try {
    const response = await axios.put(`/cart/update/${productId}`, { quantity: newQuantity }); // Adjust route if needed
    if (response.status === 200) {
      // Update the item's subtotal and the cart total
      const row = event.target.closest('tr');
      const subtotalCell = row.querySelector('td:nth-child(4)'); 
      const productPrice = parseFloat(row.querySelector('td:nth-child(2)').textContent.replace('$', '')); 

      subtotalCell.textContent = `$${(productPrice * newQuantity).toFixed(2)}`;
      updateCartTotal(response.data); // Assuming the response includes the updated cart
    } else {
      console.error('Failed to update quantity:', response.status); 
      alert('Failed to update quantity.');
    }

  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('An error occurred while updating the quantity.'); 
  }
}

// Function to handle decrement quantity
function handleDecrementQuantity(event) {
  const productId = event.target.dataset.productId;
  const input = document.querySelector(`.update-quantity-input[data-product-id="${productId}"]`);
  const newQuantity = Math.max(1, parseInt(input.value) - 1);
  input.value = newQuantity;
  handleUpdateQuantity({ target: input });
}

// Function to handle increment quantity
function handleIncrementQuantity(event) {
  const productId = event.target.dataset.productId;
  const input = document.querySelector(`.update-quantity-input[data-product-id="${productId}"]`);
  const newQuantity = parseInt(input.value) + 1;
  input.value = newQuantity;
  handleUpdateQuantity({ target: input });
}

// Call fetchAndDisplayCart when the page loads
fetchAndDisplayCart();
