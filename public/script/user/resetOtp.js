const resend = document.getElementById("resend")
resend.addEventListener("click", function () {
  generateOTP()
})
function verifyEmail() {
  event.preventDefault() // Prevent the default behavior

  const email = document.getElementById("email").value
  const url = "/auth/password/email"
  const data = {
    email: email,
  }
  console.log(email)
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type if sending JSON data
      // Add any other headers if required
    },
    body: JSON.stringify({ email: document.getElementById("email").value }), // Convert data to JSON format if needed
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.log("Success:", data)
        emailinput.style.border = "2px solid red"
        document.getElementById("errorMessage").textContent = data.error
      } else {
        // If email verification is successful, generate OTP
        generateOTP()
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

function generateOTP() {
  // Display a message to the user indicating that an OTP is being sent
  document.getElementById("errorMessage").textContent = "Sending OTP..."

  const url = "/auth/password/otp" // Endpoint to generate OTP
  const data = {
    email: email, // Send the email address
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type if sending JSON data
    },
    body: JSON.stringify(data), // Convert data to JSON format if needed
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // OTP generated successfully
        // Display a message to the user indicating that the OTP has been sent
        document.getElementById("errorMessage").textContent =
          "OTP sent successfully."

        // Now show the OTP prompt
        showOTPPrompt()
      } else {
        // Display an error message
        document.getElementById("errorMessage").textContent = data.error
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

function showOTPPrompt() {
  Swal.fire({
    title: "Enter OTP",
    text: "An otp has been sent to your email",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    background: "linear-gradient(to right, #081c15, #0d291f, #16372a)",
    //- color: "#cac5c5",
    cancelButtonText: "Cancel",
    html: "I will close in <b></b> seconds.",
    timer: 40000,
    //- timerProgressBar: true,
    confirmButtonText: "Verify",
    didOpen: () => {
      //- Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b")
      timerInterval = setInterval(() => {
        timer.textContent = Math.trunc(`${Swal.getTimerLeft() / 1000}`)
      }, 1000)
    },
    willClose: () => {
      resend.style.display = "block"
      clearInterval(timerInterval)
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Send the OTP to the server for verification
      const otp = result.value // Get the entered OTP from the user
      const data = {
        email: email,
        otp: otp,
      }

      fetch("/auth/password/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.success == true) {
            // Redirect to the password reset page
            window.location.href = "/auth/password/new"
          } else {
            // Display an error message
            document.getElementById("errorMessage").textContent = data.message
          }
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  })
}
