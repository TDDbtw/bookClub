//////////////////////
// render error handler errors
const urlParams = new URLSearchParams(window.location.search)
const errorMessage = urlParams.get("error")
console.log(errorMessage)
if (errorMessage) {
  document.getElementById("errorMessage").innerHTML =
    decodeURIComponent(errorMessage)
}

////////////////////

// Add a click event listener to the submit button
document.getElementById("formButton").addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault()

  // Initialize an empty array to store error messages
  const errorMessages = []

  // Validate the form fields
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Validate name
  if (!validateName(name)) {
    errorMessages.push("Invalid name")
  }

  // Validate email
  if (!validateEmail(email)) {
    errorMessages.push("Invalid email")
  }

  // Validate password
  if (!validatePassword(password)) {
    errorMessages.push("Invalid password")
  }

  // Validate confirm password
  if (!validateConfirmPassword(confirmPassword, password)) {
    errorMessages.push("Confirmation password does not match")
  }

  // Check if there are any error messages
  if (errorMessages.length > 0) {
    // Display the error messages using SweetAlert
    Swal.fire({
      icon: "error",
      title: "Validation Errors",
      text: errorMessages.join("\n"),
    })
  } else {
    // If validation passes, show the SweetAlert and trigger OTP sending logic
    Swal.fire({
      icon: "info",
      title: "OTP Sent!",
      text: "An OTP has been sent to your email. Click OK to continue.",
    }).then((result) => {
      if (result.isConfirmed) {
        // window.location.href = "/auth/otp"
        document.getElementById("signUpForm").submit()
      }
    })
  }
})

// Validation functions
function validateName(name) {
  const errors = []

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters")
  }
  if (name.length > 12) {
    errors.push("Name must be less than 12 characters")
  }
  if (/[0-9]/.test(name)) {
    errors.push("Name Must not contain numbers")
  }

  return errors.length === 0
}

function validateEmail(email) {
  const errors = []

  if (!email.includes("@")) {
    errors.push("Email must contain an @ symbol ")
  }
  if (
    !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
      email
    )
  ) {
    errors.push("Please enter a valid email address")
  }

  return errors.length === 0
}

function validatePassword(password) {
  const errors = []

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a numbers")
  }

  return errors.length === 0
}

function validateConfirmPassword(confirmPassword, password) {
  const errors = []

  if (confirmPassword != password) {
    errors.push("Passwords do not match")
  }

  return errors.length === 0
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
}
