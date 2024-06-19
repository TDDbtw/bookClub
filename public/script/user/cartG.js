let cartData = {
  items: [
    { id: 1, name: "Apple", quantity: 2, price: 1.00 } 
  ],
  total: 2.00
};

const cartItemsElement = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

function updateCartDisplay() {
  cartItemsElement.innerHTML = ''; // Clear previous items

  cartData.items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x <span class="item-quantity">${item.quantity}</span> 
      - $${(item.price * item.quantity).toFixed(2)} 
      <button onclick="increaseQuantity(${item.id})">+</button>
      <button onclick="decreaseQuantity(${item.id})">-</button>
      <button onclick="removeItem(${item.id})">Remove</button>
    `;
    cartItemsElement.appendChild(li);
  });

  cartTotalElement.textContent = cartData.total.toFixed(2);
}

function increaseQuantity(itemId) {
  const item = cartData.items.find(item => item.id === itemId);
  if (item) {
    item.quantity++;
    cartData.total += item.price;
    updateCartDisplay();
  }
}

function decreaseQuantity(itemId) {
  const item = cartData.items.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    cartData.total -= item.price;
    updateCartDisplay();
  } 
}

$(document).ready(function(){
  const productId = document.querySelector('input[name="productId"]').value
  const quantity = document.getElementById("quantity-input")
  $(".decrement-button").click(function(){
    $.post(`/cart/update/${productId}/?quantity=sub`, function(data, status){
      $(document).ajaxStop(function(){
    window.location.reload();
})
});

  });
})
$(document).ready(function(){
  const productId = document.querySelector('input[name="productId"]').value
  const quantity = document.getElementById("quantity-input")
  $(".increment-button").click(function(){
    $.post(`/cart/update/${productId}/?quantity=add`, function(data, status){
      //$(document).ajaxStop(function(){
    //window.location.reload();
        console.log(JSON.stringify(data.quantity))
        let res = JSON.stringify(data.quantity)
         // $('#result').load(location.href + "");
          // $('#result').load(location.href + " #result");
    window.location.reload();

        // document.getElementById("#result").innerHTML = data;
//})
});

  });
})
function removeItem(itemId) {
  cartData.items = cartData.items.filter(item => item.id !== itemId);
  // Update total (you'll need to recalculate based on remaining items)
  cartData.total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  updateCartDisplay();
}

// Initial cart display
updateCartDisplay();
