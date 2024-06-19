function dUser(userId) {
  if (window.confirm("Are you sure about deleting this user?")) {
    fetch(`/admin/users/${userId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // You may need to include additional headers like authorization if required
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., redirect or update UI
          console.log("User deleted successfully")
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
