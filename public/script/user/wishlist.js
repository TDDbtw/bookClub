const wishlistTableBody = document.querySelector('.wishlist-table tbody');
const emptyWishlistMessage = document.querySelector('.wishlist-content'); // Select the wishlist content container
const user = document.getElementById('userInput').value
// Function to fetch and display wishlist data
async function fetchAndDisplayWishlist() {
  try {
    const response = await axios.get('/user/wishlist/list'); // Adjust route if needed
    const wishlist = response.data;

    if (wishlist && wishlist.items.length > 0) {
      // Populate the wishlist table
      wishlistTableBody.innerHTML = ''; // Clear any existing items

      wishlist.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="product-info">
              <a class='productRef' href="/products/${item.product._id}">
              <img src="${item.product.image[0]}" alt="${item.product.name}" width="50" height="70">
              </a>
              <a class='productRef' href="/products/${item.product._id}">
              <span>${item.product.name}</span>
              </a>
            </div>
          </td>
          <td>$${item.product.price.toFixed(2)}</td>
          <td>
            <button type="button" data-product-id="${item.product._id}" data-product-id="${item.product._id}" class="add-to-cart-btn">Add to Cart</button>
            <button type="button" data-product-id="${item.product._id}" data-productId="${item.product._id}" class="remove-btn">Remove</button>
          </td>
        `;
        wishlistTableBody.appendChild(row);
      });

      // Add event listeners to buttons
      addEventListenersToWishlistButtons();

    } else {
      // Show the "empty wishlist" message
      emptyWishlistMessage.innerHTML = '<p>Your wishlist is empty.</p>';
    }

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    alert('An error occurred while loading your wishlist. Please try again later.');
  }
}

// Function to add event listeners to wishlist buttons
function addEventListenersToWishlistButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  const removeButtons = document.querySelectorAll('.remove-btn');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });

  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
}

// Function to handle adding item to cart
async function handleAddToCart(event) {
  const productId = event.target.dataset.productId;
  try {
    const response = await axios.post(`/cart/add/${productId}`,{user}); // Adjust route if needed
    if (response.status === 200) {
    Toastify({
    text: "Item added to Cart",
    duration: 3000

    }).showToast();
    
    window.location.href = "/cart";
    } else {
      console.error('Failed to add item to wishlist:', response.status);
      alert('Failed to add item to wishlist.');
    }
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    alert('An error occurred while adding the item to the wishlist.');
  }
}

// Function to handle item removal
async function handleRemoveItem(event) {
  const productId = event.target.dataset.productId;
console.log(`${productId}`)

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
    const response = await axios.delete(`/user/wishlist/remove/${productId}`); // Adjust route if needed
    if (response.status === 200) {
      // Remove item from the table
      event.target.closest('tr').remove();

        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      // If wishlist is empty, show empty message
      if (wishlistTableBody.children.length === 0) {
        emptyWishlistMessage.innerHTML = '<p>Your wishlist is empty.</p>';
      }
    } else {
      console.error('Failed to remove item:', response.status);
      alert('Failed to remove item from wishlist.');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    alert('An error occurred while removing the item.');
  }
}
}

// Call fetchAndDisplayWishlist when the page loads
fetchAndDisplayWishlist();
