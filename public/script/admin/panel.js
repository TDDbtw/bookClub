const content = document.getElementById("containerFluid")
const userLink = document.getElementById("userList")
const orderLink = document.getElementById("productList")
const dashLink = document.getElementById("dashboard")
const title = document.getElementById("title")

// Add event listeners to the links
dashboard.addEventListener("click", dashLink)
userLink.addEventListener("click", getUserList)
orderLink.addEventListener("click", getProductList)

function getDashboard() {
  fetch("/admin/")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
      title.innerHTML = "Dashb"
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the user list
function getUserList() {
  fetch("/admin/users")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the product page
function getProductList() {
  fetch("/admin/products")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}
// Function to load the order page
function getOrderList() {
  fetch("/admin/orders")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the Transaction page
function getTransactionsList() {
  fetch("/admin/Transactions")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the coupons page
function getCouponList() {
  fetch("/admin/coupons")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the sales page
function getSalesList() {
  fetch("/admin/sales")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html
    })
    .catch((error) => {
      console.error(error)
    })
}

// Function to load the coupons page
// function getCouponList() {
//   fetch("/admin/coupons")
//     .then((response) => response.text())
//     .then((html) => {
//       content.innerHTML = html
//     })
//     .catch((error) => {
//       console.error(error)
//     })
// }
