console.log(`edit offer running `)
const namePattern = /^[a-zA-Z\s-]+$/;
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('offerEditForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  function validateForm() {
    let isValid = true;

    // Validate Name
    const name = document.getElementById('name');
    if (name.value.length ===0 ) {
      showError('nameError', 'Offer name is required');
      isValid = false;
    } 
    else if (name.value!= name.value.trim()){
      showError('nameError',"Offer name Cant be start with a space")
      isValid = false;
    }
    else if (!namePattern.test(name.value)){
      showError('nameError',"Enter A Valid Name")
      isValid = false;
    }
    else {
      clearError('nameError');
    }

    // Validate Description
    const description = document.getElementById('description');
    if (description.value.trim() === '') {
      showError('descriptionError', 'Description is required');
      isValid = false;
    } else {
      clearError('descriptionError');
    }

    // Validate Discount Percentage
    const discountPercentage = document.getElementById('discountPercentage');
    if (discountPercentage.value.trim() === '' || isNaN(discountPercentage.value) || parseFloat(discountPercentage.value) < 0 || parseFloat(discountPercentage.value) > 100) {
      showError('discountPercentageError', 'Please enter a valid discount percentage (0-100)');
      isValid = false;
    } else {
      clearError('discountPercentageError');
    }

    // Validate Dates
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    if (startDate > endDate) {
      showError('endDateError', 'End date must be after start date');
      isValid = false;
    } else {
      clearError('startDateError');
      clearError('endDateError');
    }

    // Validate Max and Min Amount
    const maxAmt = parseFloat(document.getElementById('maxAmt').value);
    const minAmt = parseFloat(document.getElementById('minAmt').value);
    if (isNaN(maxAmt) || isNaN(minAmt) || maxAmt < minAmt) {
      showError('maxAmtError', 'Maximum amount must be greater than or equal to minimum amount');
      isValid = false;
    } else {
      clearError('maxAmtError');
      clearError('minAmtError');
    }

    return isValid;
  }

  function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
  }

  function clearError(elementId) {
    document.getElementById(elementId).textContent = '';
  }




  function submitForm() {
    const formData = new FormData(form);
    const offerId = form.getAttribute('data-offer-id');  // Ensure this attribute is correctly set

    console.log(`offer id is ${offerId}`) 

    axios.patch(`/admin/offers/${offerId}/edit`, Object.fromEntries(formData))
      .then(response => {
        const data = response.data;
        if (data.success) {
          window.toast.success('Offer updated successfully');
       setTimeout(() => {
          window.location.href = '/admin/offers';
        }, 1000);
        } else {
          window.toast.info('Failed to update the offer. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error is the:', error);
        window.toast.error(error);
      });
  }
});
