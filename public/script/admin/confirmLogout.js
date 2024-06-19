document
  .getElementById("navLogout")
  .addEventListener("click", function (event) {
    event.preventDefault()
    Swal.fire({
      title: "Are Sure Wanna log out?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
      closeOnConfirm: true,
      closeOnCancel: true,
    }).then((result) => {
      if (result.value === true) {
        Swal.fire("Logging out...") // Display a loading message if needed
        // Perform the logout action or fetch request here
        fetch("/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        })
          .then((response) => response.json())
          .then((data) => {
            Swal.fire({
              title: "User logged out",
              type: "success",
            }).then(() => {
              // Redirect to the homepage after successful logout
              window.location.href = "/"
            })
          })
          .catch((error) => {
            console.error("Error:", error)
            Swal.fire({
              title: "Error",
              text: "An error occurred during logout",
              type: "error",
            })
          })
      }
    })
  })
