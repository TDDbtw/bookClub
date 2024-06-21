const editPwd = document.querySelector('#editPwd');
const pwdGroup = document.querySelectorAll('.pwdGroup'); 
pwdGroup.forEach((item)=>{
item.style.display='none'
})
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.editInfo-form');
  const formButton = document.getElementById('formButton');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Gather form data
    const formData = new FormData(form);

    // Debugging: Print out formData content
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // Make the Axios request
    axios.patch('/user/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Profile updated successfully:', response.data);
      alert('Profile updated successfully');
window.location = "/user/profile"
      // Optionally, you can redirect the user or update the UI to reflect the changes
    })
    .catch(error => {
      console.error('There was an error updating the profile:', error);
      alert('There was an error updating the profile');
      // Optionally, handle the error, e.g., display an error message
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
