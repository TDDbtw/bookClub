document.getElementById("otpButton").addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault()

  // Validate the form fields
  const otpError = document.getElementById("otpError")
  const otp = document.getElementById("otp-input").value

  if (otpError.innerText.length > 0 || otp.length == 0) {
    // Show an error message
    alert("Please fill all required fields")
  } else {
    // Assuming you have a variable 'userEnteredOTP' that contains the user-entered OTP
    const userEnteredOTP = otp // Replace with the actual user-entered OTP

    // Make a request to your server endpoint for OTP verification
    fetch("/auth/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Include the actual user-entered OTP in the request body
      body: JSON.stringify({ otp: userEnteredOTP }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the OTP verification was successful
        if (data.success) {
          // Display a success SweetAlert
          Swal.fire({
            icon: "success",
            title: "OTP Verification Successful,Please Login to Continue",
            text: data.message,
          }).then(() => {
            window.location.href = "/auth/save"
          })
        } else {
          // Display a failure SweetAlert
          Swal.fire({
            icon: "error",
            title: "OTP Verification Failed",
            text: data.message,
          })
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }
})
