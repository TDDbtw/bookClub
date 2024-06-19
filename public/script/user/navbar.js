// // Get the login dropdown element
// const loginDropdown = document.getElementById("login-dropdown")
// const navbar = document.getElementById("navbar")
// // Create a dropdown menu element
// const dropdownMenu = document.createElement("ul")
// dropdownMenu.classList.add("dropdown-menu")

// // Create a profile link element
// const profileLink = document.createElement("li")
// const profileLinkAnchor = document.createElement("a")
// profileLinkAnchor.href = "/profile"
// profileLinkAnchor.textContent = "Profile"
// profileLink.appendChild(profileLinkAnchor)

// // Create an orders link element
// const ordersLink = document.createElement("li")
// const ordersLinkAnchor = document.createElement("a")
// ordersLinkAnchor.href = "/orders"
// ordersLinkAnchor.textContent = "Orders"
// ordersLink.appendChild(ordersLinkAnchor)

// // Create a logout link element
// const logoutLink = document.createElement("li")
// const logoutLinkAnchor = document.createElement("a")
// logoutLinkAnchor.href = "/logout"
// logoutLinkAnchor.textContent = "Logout"
// logoutLink.appendChild(logoutLinkAnchor)

// // Add the profile, orders, and logout links to the dropdown menu
// dropdownMenu.appendChild(profileLink)
// dropdownMenu.appendChild(ordersLink)
// dropdownMenu.appendChild(logoutLink)

// // Add the dropdown menu to the login dropdown element
// loginDropdown.appendChild(dropdownMenu)

// // Add an event listener for the click event on the login dropdown
// loginDropdown.addEventListener("click", () => {
//   // Toggle the visibility of the dropdown menu
//   loginDropdown.classList.toggle("show")
// })

// // Check if the user is logged in
// const isLoggedIn = () => {
//   // Get the JWT token from the cookie
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("jwt="))

//   // If the token exists, the user is logged in
//   return token !== undefined
// }

// Show or hide the login dropdown based on the user's login status
// const toggleLoginDropdown = () => {
//   if (isLoggedIn()) {
//     loginDropdown.style.display = "block"
//   } else {
//     loginDropdown.style.display = "none"
//   }
// }

// Add an event listener for the page load event
window.addEventListener("load", toggleLoginDropdown)

// const userIcon = document.querySelector(".user-icon")

// const profileOptions = document.querySelector(".profile-options")

// userIcon.addEventListener("click", () => {
//   profileOptions.classList.toggle("active")
// })
