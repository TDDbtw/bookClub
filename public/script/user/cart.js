const buttons = document.querySelectorAll(".add[data-id]")

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    console.log(e.target.dataset.id)
    addQuantity(e.target.dataset.id, button)
  })
})

async function removeItem() {
  const productId = document.getElementById("productInput").value
  const formData = new FormData()
  formData.append("productId", item.productId)
  formData.append("user", cart.user)
  const response = await fetch(`/cart/remove`, {
    method: "delete",
    body: formData,
  })
  const responseData = await response.json()
  console.log(responseData)
  // window.location.href = "/cart"
}
function dUser(productId) {
  if (window.confirm("Are you sure about deleting this Item?")) {
    fetch(`/cart/remove/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // You may need to include additional headers like authorization if required
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., redirect or update UI
          console.log("item deleted successfully")
        } else {
          // Handle errors
          console.error("Error deleting user")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }
}

function reduceQuantity() {
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
          $('#result').load(location.href + "");
          $('#result').load(location.href + " #result");

        // document.getElementById("#result").innerHTML = data;
//})
});

  });
})
// function reduceQuantity() {
//   const productId = document.querySelector('input[name="productId"]').value
//   const quantity = document.getElementById("quantity-input")
//   fetch(`/cart/update/${productId}/?quantity=sub`, {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data.quantity)
//       // window.location.reload()
//       const input = document.querySelector("span.quantity-input")
//       input.innerHTML = data.quantity.quantity
//     })
//     .catch((error) => {
//       alert("An error occurred while removing the item from the cart.")
//     })
// }
// function addQuantity(productId, input) {
//   const quantity = document.getElementById("quantity-input")

//   fetch(`/cart/update/${productId}/?quantity=add`, {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       // const input = document.querySelector("span.quantity-input")
//       const closest = input.closest(".quantity-input")
//       closest.innerHTML = data.quantity.quantity
//       // Update the DOM with the new quantity
//       // quantity.value = data.quantity

//       if (data.error)
//         document.getElementById("errorMessage").innerHTML = data.error
//     })
//     .catch((error) => {
//       // Handle errors if necessary
//       console.error("Error:", error)
//     })
// }
