console.log(`edit offer running `)
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
    if (name.value.trim() === '') {
      showError('nameError', 'Offer name is required');
      isValid = false;
    } else {
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
    const offerId = form.getAttribute('data-offer-id');  // Get the offer ID from somewhere, e.g., a hidden input field or URL parameter

    fetch(`/admin/offers/${offerId}/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.toast.success('Offer updated successfully');
        // Redirect to offer list or details page
        // window.location.href = '/offers';
      }     })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while updating the offer');
    });
  }
});
