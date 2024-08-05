const editPwd = document.querySelector('#editPwd');
const pwdGroup = document.querySelectorAll('.pwdGroup'); 
pwdGroup.forEach((item) => {
  item.style.display = 'none';
});
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.editInfo-form');
  const formButton = document.getElementById('formButton');

  function validateForm() {
    let isValid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Name validation
    if (name.length < 2) {
      isValid = false;
      window.toast.error('Name must be at least 2 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      isValid = false;
      window.toast.errorMessage('Please enter a valid email address');
    }

    // Password validation (only if password fields are visible)
    if (editPwd.checked) {
      if (password.length < 8) {
        isValid = false;
        window.toast.errorMessage('Password must be at least 8 characters long');
      }
      if (password !== confirmPassword) {
        isValid = false;
        window.toast.errorMessage('Passwords do not match');
      }
    }

    return isValid;
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    // Gather form data
    const formData = new FormData(form);

    // Make the Axios request
    axios.patch('/user/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Profile updated successfully:', response.data);
      window.toast.success('Profile updated successfully');
      setTimeout(() => {
        window.location.href = "/user/profile";
      }, 1000);
    })
    .catch(error => {
      console.error('There was an error updating the profile:', error);
      window.toast.error(error);
    });
  });
  // jQuery code for highlighting the current menu item
  $(document).ready(function() {
    // Get the current URL
    var currentUrl = window.location.pathname;

    // Loop through each anchor tag and compare the href attribute with the current URL
    $('.my-account-menu li a').each(function() {
      var href = $(this).attr('href');

      // Check if the current URL matches the href attribute
      if (currentUrl === href) {
        // Apply the background color to the parent li
        $(this).parent('li').css('background', 'linear-gradient(to right, #b71540, #e55039)');
      }
    });
  });
});



    $(document).ready(function() {
      $('#toggle-password').change(function() {
        if ($(this).is(':checked')) {
          $('#password-fields').removeClass('hidden');
          $('#confirm-password-fields').removeClass('hidden');
        } else {
          $('#password-fields').addClass('hidden');
          $('#confirm-password-fields').addClass('hidden');
        }
      });
    });
// pwd check



  editPwd.addEventListener('click', function(event) {
if(editPwd.checked){
pwdGroup.forEach((item)=>{
item.style.display='block'
})
document.getElementById('closePwd').style.display="block"
}
})

 document.getElementById('closePwd').addEventListener('click', function(event) {
pwdGroup.forEach((item)=>{
item.style.display='none'
editPwd.checked=false
})

document.getElementById('closePwd').style.display="none"
 })
