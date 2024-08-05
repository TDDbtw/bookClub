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

  function validate(event) {
    let valid = true;

    // Reset previous errors and styles
    nameError.textContent = '';
    nameInput.style.border = '';
    descriptionError.textContent = '';
    descriptionInput.style.border = '';
    discountPercentageError.textContent = '';
    discountPercentageInput.style.border = '';
    startDateError.textContent = '';
    startDateInput.style.border = '';
    endDateError.textContent = '';
    endDateInput.style.border = '';
    maxAmtError.textContent = '';
    maxAmtInput.style.border = '';
    minAmtError.textContent = '';
    minAmtInput.style.border = '';

    // Validate name
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Offer name is required';
      nameInput.style.border = '2px solid red';
      valid = false;
    } else {
      nameInput.style.border = '2px solid #39ff14';
    }

    // Validate description
    if (descriptionInput.value.trim() === '') {
      descriptionError.textContent = 'Description is required';
      descriptionInput.style.border = '2px solid red';
      valid = false;
    } else {
      descriptionInput.style.border = '2px solid #39ff14';
    }

    // Validate discount percentage
    const discountPercentageValue = parseFloat(discountPercentageInput.value.trim());
    if (isNaN(discountPercentageValue) || discountPercentageValue <= 0 || discountPercentageValue > 100) {
      discountPercentageError.textContent = 'Valid discount percentage is required (1-100)';
      discountPercentageInput.style.border = '2px solid red';
      valid = false;
    } else {
      discountPercentageInput.style.border = '2px solid #39ff14';
    }

    // Validate start date
    if (startDateInput.value.trim() === '') {
      startDateError.textContent = 'Start date is required';
      startDateInput.style.border = '2px solid red';
      valid = false;
    } else {
      startDateInput.style.border = '2px solid #39ff14';
    }

    // Validate end date
    if (endDateInput.value.trim() === '') {
      endDateError.textContent = 'End date is required';
      endDateInput.style.border = '2px solid red';
      valid = false;
    } else if (new Date(startDateInput.value) >= new Date(endDateInput.value)) {
      endDateError.textContent = 'End date must be after the start date';
      endDateInput.style.border = '2px solid red';
      valid = false;
    } else {
      endDateInput.style.border = '2px solid #39ff14';
    }

    // Validate max amount
    const maxAmtValue = parseFloat(maxAmtInput.value.trim());
    if (isNaN(maxAmtValue) || maxAmtValue <= 0) {
      maxAmtError.textContent = 'Valid maximum amount is required';
      maxAmtInput.style.border = '2px solid red';
      valid = false;
    } else {
      maxAmtInput.style.border = '2px solid #39ff14';
    }

    // Validate min amount
    const minAmtValue = parseFloat(minAmtInput.value.trim());
    if (isNaN(minAmtValue) || minAmtValue <= 0) {
      minAmtError.textContent = 'Valid minimum amount is required';
      minAmtInput.style.border = '2px solid red';
      valid = false;
    } else {
      minAmtInput.style.border = '2px solid #39ff14';
    }

    // Prevent form submission if not valid
    if (!valid) {
      event.preventDefault();
    } else {
      // If form is valid, prevent default submission and send Axios request
      event.preventDefault();
      const offerData = {
        name: nameInput.value,
        description: descriptionInput.value,
        discountPercentage: discountPercentageInput.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        maxAmt: maxAmtInput.value,
        minAmt: minAmtInput.value
      };

      axios.post('/admin/offers/create', offerData)
        .then(response => {
          console.log(response.data);
          

          // Handle success (e.g., display a success message, redirect, etc.)
        })
        .catch(error => {
          console.error(error);
          window.toast.error(error)
          // Handle error (e.g., display an error message)
        });
    }
  }

  form.addEventListener('submit', validate);
  form.addEventListener('change', validate);
});
