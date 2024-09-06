//////////////////////
// render error handler errors
const urlParams = new URLSearchParams(window.location.search)
const errorMessage = urlParams.get("error")
console.log(`error message --${errorMessage}`)
if (errorMessage) {
  document.getElementById("errorMessage").innerHTML =
    decodeURIComponent(errorMessage)
}

////////////////////

// const button = document.getElementById("formButton")
// button.style.background = "red"
let erroList = []

function validateName() {
  var name = document.getElementById("name").value
  name = name.trim()
  var nameinput = document.getElementById("name")
  var nameError = document.getElementById("nameError")
  nameError.innerHTML = ""
  const errors = []

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters")
  }
  if (name.length > 12) {
    errors.push("Name must be less than 12 characters")
  }
  if (/[0-9]/.test(name)) errors.push("Name Must not contain numbers")

  if (errors.length > 0) {
    nameinput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      nameError.appendChild(errorSpan)
      nameError.appendChild(document.createElement("br")) // Add line break between errors
    })

    nameError.style.color = "red"
  } else {
    nameinput.style.border = "2px solid #39ff14"
  }
}

function validateEmail() {
  // clearErrors()
  const email = document.getElementById("email").value
  emailinput = document.getElementById("email")
  const emailError = document.getElementById("emailError")

  // Clear previous content
  emailError.innerHTML = ""

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
  if(!/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email)){
    errors.push("Disposible Email not allowed")
  }
  if (errors.length > 0) {
    // Display all accumulated errors\

    emailinput.style.border = "2px solid red"

    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      emailError.appendChild(errorSpan)
      emailError.appendChild(document.createElement("br")) // Add line break between errors
    })

    emailError.style.color = "red"
  } else {
    // Clear all errors

    emailError.innerHTML = ""
    emailinput.style.border = "2px solid #39ff14"
  }
}
function validatePassword() {
  var password = document.getElementById("password").value.trim();
  var passwordInput = document.getElementById("password");
  var passwordError = document.getElementById("passwordError");
  passwordError.innerHTML = "";
  const errors = [];

  // Length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Complexity checks
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) ){
    errors.push("Password must contain at least one lowercase letter an uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  const commonWords = ['password', 'qwerty', 'admin', '123456', 'welcome'];
  if (commonWords.some(word => password.toLowerCase().includes(word))) {
    errors.push("Password contains a common word or pattern");
  }

  if (errors.length > 0) {
    // Display all accumulated errors
    passwordInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      passwordError.appendChild(errorSpan);
      passwordError.appendChild(document.createElement("br")); // Add line break between errors
    });
    passwordError.style.color = "red";
  } else {
    passwordInput.style.border = "2px solid #39ff14";
  }
}

function enterInput(e) {
  var flag = e.getModifierState("CapsLock");
  if (flag) {
    document.getElementById("feedback").innerHTML = "CapsLock is Active";
  }else{
    document.getElementById("feedback").innerHTML = "";
  }
}
function validateConfirmPassword() {
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

// Add a click event listener to the submit button
document.getElementById("formButton").addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault()

  // Validate the form fields
  const nameError = document.getElementById("nameError")
  const name = document.getElementById("name").value
  const referralCode =document.getElementById("referralCode").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const emailError = document.getElementById("emailError")
  const passwordError = document.getElementById("passwordError")
  const confirmPasswordError = document.getElementById("confirmPasswordError")
  const refError=document.getElementById("refError")

  if (
    nameError.innerText.length > 0 ||
    name.length == 0 ||
    emailError.innerText.length > 0 ||
    email.length == 0 ||
    passwordError.innerText.length > 0 ||
    password.length == 0 ||
    confirmPasswordError.innerText.length > 0 ||
    confirmPassword.length == 0
  ) {
    // Show an error message
    alert("Please fill all the required fields")
  } else {
    let response = fetch("/auth/signup/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email,referralCode: referralCode}),
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        if (data.error) {
          document.getElementById("errorMessage").innerHTML = data.error
        } else {
          document.getElementById("signUpForm").submit()
        }
      })
      .catch((error) => console.error("Error:", error))
  }
})
//
//
//
//

// {
//   // If validation passes, show the SweetAlert and trigger OTP sending logic
//   Swal.fire({
//     icon: "info",
//     title: "OTP Sent!",
//     text: "An OTP has been sent to your email. Click OK to continue.",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       // window.location.href = "/auth/otp"
//       document.getElementById("signUpForm").submit()
//     }
//   })
// }
// .then((data) => {
//   if (data.error) {
//   } else {
//     console.log(`running ..${JSON.stringify(data)}`) // Submit the signup form
//   }
// })

    function showPwd() {
         document.getElementById("password").type = "text";
         document.getElementById("password").type = "text";
         document.getElementById("hide").style.display = "block";
         document.getElementById("show").style.display = "none";
      }
    function hidePwd() {
         document.getElementById("password").type = "password";
         document.getElementById("show").style.display = "block";
         document.getElementById("hide").style.display = "none";
      }
