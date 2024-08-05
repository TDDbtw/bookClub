document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('couponForm');
  const nameInput = document.getElementById('name');
  const descriptionInput = document.getElementById('description');
  const discountPercentageInput = document.getElementById('discountPercentage');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const maxAmtInput = document.getElementById('maxAmt');
  const minAmtInput = document.getElementById('minAmt');

  const nameError = document.getElementById('codeError');
  const descriptionError = document.getElementById('descriptionError');
  const discountPercentageError = document.getElementById('discountPercentageError');
  const startDateError = document.getElementById('startDateError');
  const endDateError = document.getElementById('endDateError');
  const maxAmtError = document.getElementById('maxAmtError');
  const minAmtError = document.getElementById('minAmtError');

  const inputs = [nameInput, descriptionInput, discountPercentageInput, startDateInput, endDateInput, maxAmtInput, minAmtInput];
  const errorElements = [nameError, descriptionError, discountPercentageError, startDateError, endDateError, maxAmtError, minAmtError];

  function validate(event) {
    event.preventDefault();
    let isValid = true;

    // Reset previous errors and styles
    errorElements.forEach(el => el.textContent = '');
    inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));

    // Validate name
    if (nameInput.value.trim() === '') {
      showError(nameInput, nameError, 'Offer name is required');
      isValid = false;
    } else {
      nameInput.classList.add('is-valid');
    }

    // Validate description
    if (descriptionInput.value.trim() === '') {
      showError(descriptionInput, descriptionError, 'Description is required');
      isValid = false;
    } else {
      descriptionInput.classList.add('is-valid');
    }

    // Validate discount percentage
    const discountPercentageValue = parseFloat(discountPercentageInput.value.trim());
    if (isNaN(discountPercentageValue) || discountPercentageValue <= 0 || discountPercentageValue > 100) {
      showError(discountPercentageInput, discountPercentageError, 'Valid discount percentage is required (1-100)');
      isValid = false;
    } else {
      discountPercentageInput.classList.add('is-valid');
    }

    // Validate start date
    if (startDateInput.value.trim() === '') {
      showError(startDateInput, startDateError, 'Start date is required');
      isValid = false;
    } else {
      startDateInput.classList.add('is-valid');
    }

    // Validate end date
    if (endDateInput.value.trim() === '') {
      showError(endDateInput, endDateError, 'End date is required');
      isValid = false;
    } else if (new Date(startDateInput.value) >= new Date(endDateInput.value)) {
      showError(endDateInput, endDateError, 'End date must be after the start date');
      isValid = false;
    } else {
      endDateInput.classList.add('is-valid');
    }

    // Validate max amount
    const maxAmtValue = parseFloat(maxAmtInput.value.trim());
    if (isNaN(maxAmtValue) || maxAmtValue <= 0) {
      showError(maxAmtInput, maxAmtError, 'Valid maximum amount is required');
      isValid = false;
    } else {
      maxAmtInput.classList.add('is-valid');
    }

    // Validate min amount
    const minAmtValue = parseFloat(minAmtInput.value.trim());
    if (isNaN(minAmtValue) || minAmtValue <= 0) {
      showError(minAmtInput, minAmtError, 'Valid minimum amount is required');
      isValid = false;
    } else if (minAmtValue >= maxAmtValue) {
      showError(minAmtInput, minAmtError, 'Minimum amount must be less than maximum amount');
      isValid = false;
    } else {
      minAmtInput.classList.add('is-valid');
    }

    if (isValid) {
      submitForm();
    }
  }

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add('is-invalid');
  }

  function submitForm() {
    const offerData = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      discountPercentage: parseFloat(discountPercentageInput.value.trim()),
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      maxAmt: parseFloat(maxAmtInput.value.trim()),
      minAmt: parseFloat(minAmtInput.value.trim())
    };

    axios.post('/admin/offers/create', offerData)
      .then(response => {
        console.log(response.data);
        window.toast.success('Offer created successfully');
        // Handle success (e.g., redirect or reset form)
        form.reset();
        inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));


       setTimeout(() => {
          window.location.href = "/admin/offers";
        }, 1000);
      })
      .catch(error => {
        console.error('Error creating offer:', error);
        window.toast.error(error.response?.data?.message || 'An error occurred while creating the offer');
        // Handle specific errors if needed
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([field, message]) => {
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
              showError(document.getElementById(field), errorElement, message);
            }
          });
        }
      });
  }

  form.addEventListener('submit', validate);
});
