  // Form validation functions
  function validateOfferName() {
    const offerName = document.getElementById("offerName").value.trim();
    const offerNameInput = document.getElementById("offerName");
    const offerNameError = document.getElementById("offerNameError");
    offerNameError.innerHTML = "";
    const errors = [];

    if (offerName.length < 3) {
      errors.push("Offer name must be at least 3 characters");
    }
    if (offerName.length > 100) {
      errors.push("Offer name must be less than 100 characters");
    }

    if (errors.length > 0) {
      offerNameInput.style.border = "2px solid red";
      errors.forEach((error) => {
        const errorSpan = document.createElement("span");
        errorSpan.innerText = error;
        offerNameError.appendChild(errorSpan);
        offerNameError.appendChild(document.createElement("br")); // Add line break between errors
      });
      offerNameError.style.color = "red";
      return false;
    } else {
      offerNameInput.style.border = "2px solid #39ff14";
      return true;
    }
  }

  function validateDiscountType() {
    const discountType = document.getElementById("discountType").value;
    const discountTypeInput = document.getElementById("discountType");
    const discountTypeError = document.getElementById("discountTypeError");
    discountTypeError.innerHTML = "";

    if (!discountType) {
      discountTypeInput.style.border = "2px solid red";
      discountTypeError.innerText = "Please select a discount type.";
      discountTypeError.style.color = "red";
      return false;
    } else {
      discountTypeInput.style.border = "2px solid #39ff14";
      return true;
    }
  }

  function validateDiscountValue() {
    const discountValue = document.getElementById("discountValue").value.trim();
    const discountValueInput = document.getElementById("discountValue");
    const discountValueError = document.getElementById("discountValueError");
    discountValueError.innerHTML = "";
    const errors = [];


    if (discountValue=='') {
      errors.push("Enter the discount value");
    }
    if (isNaN(discountValue) || parseFloat(discountValue) <= 0) {
      errors.push("Discount must be a positive number");
    }

    if (errors.length > 0) {
      discountValueInput.style.border = "2px solid red";
      errors.forEach((error) => {
        const errorSpan = document.createElement("span");
        errorSpan.innerText = error;
        discountValueError.appendChild(errorSpan);
        discountValueError.appendChild(document.createElement("br")); // Add line break between errors
      });
      discountValueError.style.color = "red";
      return false;
    } else {
      discountValueInput.style.border = "2px solid #39ff14";
      return true;
    }
  }

  function validateMaximumAmount() {
    const maximumAmount = document.getElementById("maximumAmount").value.trim();
    const maximumAmountInput = document.getElementById("maximumAmount");
    const maximumAmountError = document.getElementById("maximumAmountError");
    maximumAmountError.innerHTML = "";
    const errors = [];

    if (maximumAmount=='') {
      errors.push("Enter the Maximum amount");
    }
    if (isNaN(maximumAmount) || parseFloat(maximumAmount) <= 0) {
      errors.push("Maximum amount must be a positive number");
    }

    if (errors.length > 0) {
      maximumAmountInput.style.border = "2px solid red";
      errors.forEach((error) => {
        const errorSpan = document.createElement("span");
        errorSpan.innerText = error;
        maximumAmountError.appendChild(errorSpan);
        maximumAmountError.appendChild(document.createElement("br")); // Add line break between errors
      });
      maximumAmountError.style.color = "red";
      return false;
    } else {
      maximumAmountInput.style.border = "2px solid #39ff14";
      return true;
    }
  }

  function validateDiscountOn() {
    const discountOn = document.getElementById("discountOn").value;
    let discountOnError = document.getElementById("discountOnError");
    discountOnError.innerHTML = "";

    if (discountOn=='') {
      discountOnError.innerText = "Please select a discount type.";
      discountOnError.style.color = "red";
      return false;
    } else {
      discountOnError.style.color = "";
      return true;
    }
  }

  function validateCategoryOrProduct() {
    const discountOn = document.getElementById("discountOn").value;
    let valid = true;

    if (discountOn === "category") {
      const discountedCategory = document.querySelector("select[name='discountedCategory']").value;
      const categorySelectError = document.getElementById("categorySelect-error");
      categorySelectError.innerHTML = "";
      if (!discountedCategory) {
        categorySelectError.innerText = "Please select a category.";
        categorySelectError.style.color = "red";
        valid = false;
      } else {
        categorySelectError.style.color = "";
      }
    } else if (discountOn === "product") {
      const discountedProduct = document.querySelector("select[name='discountedProduct']").value;
      const productSelectError = document.getElementById("productSelect-error");
      productSelectError.innerHTML = "";
      if (!discountedProduct) {
        productSelectError.innerText = "Please select a product.";
        productSelectError.style.color = "red";
        valid = false;
      } else {
        productSelectError.style.color = "";
      }
    }
    return valid;
  }

  function validateDates() {
    const startDate = document.getElementById("startDate").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const startDateInput = document.getElementById("startDate");
    const expiryDateInput = document.getElementById("expiryDate");
    const startDateError = document.getElementById("startDateError");
    const expiryDateError = document.getElementById("expiryDateError");
    startDateError.innerHTML = "";
    expiryDateError.innerHTML = "";
    let valid = true;

    if (!startDate) {
      startDateInput.style.border = "2px solid red";
      startDateError.innerText = "Start date is required.";
      startDateError.style.color = "red";
      valid = false;
    } else {
      startDateInput.style.border = "2px solid #39ff14";
    }

    if (!expiryDate) {
      expiryDateInput.style.border = "2px solid red";
      expiryDateError.innerText = "Expiry date is required.";
      expiryDateError.style.color = "red";
      valid = false;
    } else {
      expiryDateInput.style.border = "2px solid #39ff14";
    }

    return valid;
  }

  // Form validation before submission
  const form = document.getElementById("offerForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    const isOfferNameValid = validateOfferName();
    const isDiscountTypeValid = validateDiscountType();
    const isDiscountValueValid = validateDiscountValue();
    const isMaximumAmountValid = validateMaximumAmount();
    const isDiscountOnValid = validateDiscountOn();
    const isCategoryOrProductValid = validateCategoryOrProduct();
    const areDatesValid = validateDates();

    if (!isOfferNameValid || !isDiscountTypeValid || !isDiscountValueValid || !isMaximumAmountValid || !isDiscountOnValid || !isCategoryOrProductValid || !areDatesValid) {
      event.preventDefault();
      window.toast.error("Please fill all the required fields correctly.");
    }
    else{
        const offerData = {
          offerName: document.getElementById('offerName').value,
          discountType: document.getElementById('discountType').value,
          discountValue: document.getElementById('discountValue').value,
          maximumAmount: document.getElementById('maximumAmount').value,
          discountOn: document.getElementById('discountOn').value,
          startDate: document.getElementById('startDate').value,
          expiryDate: document.getElementById('expiryDate').value,
          product: document.getElementById('product').value,
          category: document.getElementById('category').value,
        };

        axios.post('/admin/offers/create', offerData)
          .then(response => {
            window.toast.success('Offer added successfully!');
            console.log(response.data);
            location.href='/admin/offers'
          })
          .catch(error => {
            console.error('There was an error adding the offer!', error);
            window.toast.error(error)
          });

    }

  document.getElementById("offerForm").addEventListener("change", () => {
    validateOfferName();
    validateDiscountType();
    validateDiscountValue();
    validateMaximumAmount();
    validateDiscountOn();
    validateCategoryOrProduct();
    validateDates();
  });
});

 const urlPath = window.location.pathname; 
const segments = urlPath.split('/');
  const couponId = segments[3]
if (couponId!='create'){
document.getElementById('offerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = `/admin/coupons/${couponId}/edit`;

  const offerData = {
    offerName: document.getElementById('offerName').value,
    discountType: document.getElementById('discountType').value,
    discountValue: document.getElementById('discountValue').value,
    maximumAmount: document.getElementById('maximumAmount').value,
    discountOn: document.getElementById('discountOn').value,
    startDate: document.getElementById('startDate').value,
    expiryDate: document.getElementById('expiryDate').value,
    product: document.getElementById('product').value,
    category: document.getElementById('category').value,

  };

  try {
    const response = await axios.patch(url, offerData);
    if (response.status === 200) {
      window.toast.success('Coupon updated successfully!');

      window.location.href='/admin/offers'
    } else {
      alert('Failed to update the coupon. Please try again.');
    }
  } catch (error) {
    console.error('Error updating offer:', error);
    window.error(error)
  }
});
}
