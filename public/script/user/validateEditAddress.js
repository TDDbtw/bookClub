// Add this script to your page or include it in your JavaScript file
  const form = document.getElementById('form-validate');
  // const button = document.querySelector('form.form-address-edit');
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get the address ID from the form action
    
    const addressId = document.getElementById('addressId').value

    // Create FormData object
    const formData = new FormData(form);
    
    // Convert FormData to a plain object
    const data = Object.fromEntries(formData.entries());
    
    // Make the Axios PATCH request

  const result = await window.confirmationModal.show('Edit address', 'Do you want to change the address?');
    if (result.isConfirmed){
    axios.patch(`/user/address/${addressId}/edit`, data)
      .then(function(response) {
        console.log('Address updated successfully:', response.data.message || response.data.error);
        window.toast.success('Address updated successfully')
       setTimeout(() => {
          window.location.href = "/user/address/new";
        }, 1000);
      })
      .catch(function(error) {
        console.error('Error updating address:', error);
        // Handle error (e.g., show error message)
        document.getElementById('errorMessage').textContent = error.response.data.error || error.response.data.message ;
      });
    }
  });
