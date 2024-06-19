let errorList = []
function validateNewPassword() {
  var password = document.getElementById("password").value
  password = password.trim()
  var passwordinput = document.getElementById("password")
  var passwordError = document.getElementById("passwordError")

  passwordError.innerHTML = ""
  const errors = []

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a numbers")
  }

  if (errors.length > 0) {
    // Display all accumulated errors

    passwordinput.style.border = "2px solid red"

    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      passwordError.appendChild(errorSpan)
      passwordError.appendChild(document.createElement("br")) // Add line break between errors
    })

    passwordError.style.color = "red"
  } else {
    passwordinput.style.border = "2px solid #39ff14"
  }
}
function validateNewConfirmPassword() {
  var confirmPassword = document.getElementById("confirmPassword").value
  confirmPassword = confirmPassword.trim()
  var password = document.getElementById("password").value
  var confirmPasswordInput = document.getElementById("confirmPassword")
  var confirmPasswordError = document.getElementById("confirmPasswordError")

  confirmPasswordError.innerHTML = ""
  const errors = []

  if (confirmPassword != password) {
    errors.push("Passwords do not match")
  }

  if (errors.length > 0) {
    // Display all accumulated errors
    confirmPasswordInput.style.border = "2px solid red"

    errors.forEach((error) => {
      check = 0
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      confirmPasswordError.appendChild(errorSpan)
      confirmPasswordError.appendChild(document.createElement("br")) // Add line break between errors
    })

    confirmPasswordError.style.color = "red"
  } else {
    confirmPasswordInput.style.border = "2px solid #39ff14"
  }
}
document.getElementById("newFormButton").addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault()

  // Validate the form fields

  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const passwordError = document.getElementById("passwordError")
  const confirmPasswordError = document.getElementById("confirmPasswordError")
  if (
    passwordError.innerText !== "" ||
    password.length == 0 ||
    confirmPasswordError.innerText !== "" ||
    confirmPassword.length == 0
  ) {
    // Show an error message
    alert("Please fill all the required fields")
  } else {
    const password = document.getElementById("password").value
    console.log(password)
    let response = fetch("/auth/password/new/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: document.getElementById("password").value,
      }),
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        if (data.error) {
          document.getElementById("errorMessage").innerHTML = data.error
        } else {
          window.location.href = "/auth/login"
        }
      })
      .catch((error) => console.error("Error:", error))
  }
})

// function newPasswordForm() {
//   const password = document.getElementById("password").value
//   const confirmPassword = document.getElementById("confirmPassword").value
//   const passwordError = document.getElementById("passwordError")
//   const confirmPasswordError = document.getElementById("confirmPasswordError")

//   if (
//     passwordError.innerText !== "" ||
//     password.length === 0 ||
//     confirmPasswordError.innerText !== "" ||
//     confirmPassword.length === 0
//   ) {
//     // Show an error message
//     alert("Please fill all the required fields")
//     return false // Validation failed
//   }

//   return true // Validation successful
// }

// document.getElementById("newFormButton").addEventListener("click", (event) => {
//   // Prevent the form from submitting
//   event.preventDefault()

//   // Validate the form fields
//   if (passwordForm()) {
//     // If validation is successful, proceed with the fetch and submission logic
//     let response = fetch("auth/password/new/save", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ password: password }),
//     })
//       .then(function (response) {
//         return response.json()
//       })
//       .then(function (data) {
//         console.log(data)
//         if (data.error) {
//           document.getElementById("errorMessage").innerHTML = data.error
//         } else {
//           document.getElementById("passwordForm").submit()
//         }
//       })
//       .catch((error) => console.error("Error:", error))
//   }
// })
