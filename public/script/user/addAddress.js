let erroList = []

function validateAddress() {
  var address = document.getElementById("address").value
  address = address.trim()
  var addressInput = document.getElementById("address")
  var addressError = document.getElementById("addressError")
  addressError.innerHTML = ""
  const errors = []

  if (address.length < 5) {
    errors.push("Address must be at least 5 characters")
  }
  if (address.length > 50) {
    errors.push("Address must be less than 50 characters")
  }
  // You might want to customize the regular expression based on the allowed characters in an address
  if (/[^a-zA-Z0-9\s,.-]/.test(address)) {
    errors.push("Address must not contain special characters")
  }

  if (errors.length > 0) {
    addressInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.style.color = "red"
      errorSpan.innerText = error
      addressError.appendChild(errorSpan)
      addressError.appendChild(document.createElement("br")) // Add line break between errors
    })

    addressError.style.color = "red"
  } else {
    addressInput.style.border = "2px solid #39ff14"
  }
}

function validateCity() {
  var city = document.getElementById("city").value
  city = city.trim()
  var cityInput = document.getElementById("city")
  var cityError = document.getElementById("cityError")
  cityError.innerHTML = ""
  const errors = []

  if (city.length < 3) {
    errors.push("City must be at least 3 characters")
  }
  if (city.length > 20) {
    errors.push("City must be less than 20 characters")
  }
  // You might want to customize the regular expression based on the allowed characters in a city name
  if (/[^a-zA-Z\s]/.test(city)) {
    errors.push("City must only contain letters and spaces")
  }

  if (errors.length > 0) {
    cityInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      errorSpan.style.color = "red"
      cityError.appendChild(errorSpan)
      cityError.appendChild(document.createElement("br")) // Add line break between errors
    })

    cityError.style.color = "red"
  } else {
    cityInput.style.border = "2px solid #39ff14"
  }
}

function validateState() {
  var state = document.getElementById("state").value
  state = state.trim()
  var stateInput = document.getElementById("state")
  var stateError = document.getElementById("stateError")
  stateError.innerHTML = ""
  const errors = []
console.log(`state is ---> ${state}`)
  if (Number(state) < 0 || state=="") {
    errors.push("please select a state")
  }
  // if (state.length > 20) {
  //   errors.push("State must be less than 20 characters")
  // }
  // // You might want to customize the regular expression based on the allowed characters in a state name
  // if (/[^a-zA-Z\s]/.test(state)) {
  //   errors.push("State must only contain letters and spaces")
  // }

  if (errors.length > 0) {
    stateInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      errorSpan.style.color = "red"
      stateError.appendChild(errorSpan)
      stateError.appendChild(document.createElement("br")) // Add line break between errors
    })

    stateError.style.color = "red"
  } else {
    stateInput.style.border = "2px solid #39ff14"
  }
}

function validateZip() {
  var zip = document.getElementById("zip").value
  zip = zip.trim()
  var zipInput = document.getElementById("zip")
  var zipError = document.getElementById("zipError")
  zipError.innerHTML = ""
  const errors = []

  if (zip.length !== 6) {
    errors.push("Zip code must be exactly 6 characters")
  }
  if (!/^\d+$/.test(zip)) {
    errors.push("Zip code must only contain numbers")
  }

  if (errors.length > 0) {
    zipInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.style.color = "red"
      errorSpan.innerText = error
      zipError.appendChild(errorSpan)
      zipError.appendChild(document.createElement("br")) // Add line break between errors
    })

    zipError.style.color = "red"
  } else {
    zipInput.style.border = "2px solid #39ff14"
  }
}

function validateCountry() {
  var country = document.getElementById("country").value
  country = country.trim()
  var countryInput = document.getElementById("country")
  var countryError = document.getElementById("countryError")
  countryError.innerHTML = ""
  const errors = []

  if (country.length < 2) {
    errors.push("Country must be at least 2 characters")
  }
  if (country.length > 30) {
    errors.push("Country must be less than 30 characters")
  }
  // You might want to customize the regular expression based on the allowed characters in a country name
  if (/[^a-zA-Z\s]/.test(country)) {
    errors.push("Country must only contain letters and spaces")
  }

  if (errors.length > 0) {
    countryInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.style.color = "red"
      errorSpan.innerText = error
      countryError.appendChild(errorSpan)
      countryError.appendChild(document.createElement("br")) // Add line break between errors
    })

    countryError.style.color = "red"
  } else {
    countryInput.style.border = "2px solid #39ff14"
  }
}

// Add a click event listener to the submit button
document.getElementById("saveAddress").addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault()
validateAddress()
validateCountry()
validateState()
validateCity()
validateZip()

  // Validate the form fields
  const addressError = document.getElementById("addressError")
  const address = document.getElementById("address").value
  const state = document.getElementById("state").value
  const zip = document.getElementById("zip").value
  const country = document.getElementById("country").value
  const stateError = document.getElementById("stateError")
  const zipError = document.getElementById("zipError")
  const countryError = document.getElementById("countryError")
  const city = document.getElementById("city").value
  const cityError = document.getElementById("cityError")


  if (
    addressError.innerText.length > 0 ||
    address.length == 0 ||
    stateError.innerText.length > 0 ||
    state.length == 0 ||
    zipError.innerText.length > 0 ||
    zip.length == 0 ||
    countryError.innerText.length > 0 ||
    country.length == 0
  ) {
    // Show an error message
    alert("Please fill all the required fields")
  } else {
    let response = fetch(`/user/address/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: address,
        state: state,
        city: city,
        zip_code: zip,
        country: country,
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
          window.location.href = "/user/profile"
        }
      })
      .catch((error) => console.error("Error:", error))
  }
})

          async function removeAddress() {
              const addressIdElement = document.getElementById("addressInput");
              const userId = document.getElementById("userInput").value;
            let addressId=undefined
            if(addressIdElement.getAttribute('value')){
               addressId = addressIdElement.getAttribute('value');
          }
              console.log(`user is ${userId}`);

              Swal.fire({
                  title: 'Are you sure?',
                  text: 'You are about to delete this address.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'No, cancel!',
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
              }).then(async (result) => { // `async` added here for the callback function
                  if (result.isConfirmed) {
                      try {
                          const response = await fetch(`/user/address/${addressId}/remove`, {
                              method: "DELETE",
                              headers: {
                                  "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ address: addressId, user: userId }),
                          });

                          const data = await response.json();

                          if (data.success) {
                              // Show SweetAlert success message
                              Swal.fire({
                                  icon: 'success',
                                  title: 'Success!',
                                  text: data.message, // changed from response.message to data.message
                                  showConfirmButton: false,
                                  timer: 2500,
                                  timerProgressBar: true,
                              }).then(() => {
                                  window.location.reload();
                              });
                          } else {
                              // Show SweetAlert error message
                              Swal.fire({
                                  icon: 'error',
                                  title: 'Oops...',
                                  text: 'Deletion failed!',
                              });
                          }
                      } catch (error) {
                          console.error("Error:", error);
                          // Handle errors as needed
                      }
                  }
              });
          }



    countrySelect.addEventListener('change', () => {
      validateCountry
    });
    stateSelect.addEventListener('change', () => {
      validateCountry
    });
