console.log(`coupon validation running`);
const form = document.getElementById('couponForm');

// Render error handler errors
const urlParams = new URLSearchParams(window.location.search);
const errorMessage = urlParams.get("error");
console.log(`error message --${errorMessage}`);
if (errorMessage) {
  document.getElementById("errorMessage").innerHTML = decodeURIComponent(errorMessage);
}

////////////////////

let errorList = [];

function validateCode() {
  var code = document.getElementById("code").value.trim();
  var codeInput = document.getElementById("code");
  var codeError = document.getElementById("codeError");
  codeError.innerHTML = "";
  const errors = [];

  if (code.length < 3) {
    errors.push("Code must be at least 3 characters");
  }
  if (code !== document.getElementById("code").value) {
    errors.push("Code can't start with a space");
  }
  if (code.length > 20) {
    errors.push("Code must be less than 20 characters");
  }
  if (/[^A-Za-z0-9]/.test(code)) {
    errors.push("Code must be alphanumeric");
  }

  if (errors.length > 0) {
    codeInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      codeError.appendChild(errorSpan);
      codeError.appendChild(document.createElement("br")); // Add line break between errors
    });
    codeError.style.color = "red";
    return false;
  } else {
    codeInput.style.border = "2px solid #39ff14";
    return true;
  }
}

function validateDiscount() {
  var discount = document.getElementById("discount").value.trim();
  var discountInput = document.getElementById("discount");
  var discountError = document.getElementById("discountError");
  discountError.innerHTML = "";
  const errors = [];

  if (discount=="") {
    errors.push("Please Enter The Discount");
  }
  if (isNaN(discount) || parseFloat(discount) <= 0) {
    errors.push("Discount must be a positive number");
  }
  if (parseFloat(discount) > 100) {
    errors.push("Discount must be less than or equal to 100");
  }

  if (errors.length > 0) {
    discountInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      discountError.appendChild(errorSpan);
      discountError.appendChild(document.createElement("br")); // Add line break between errors
    });
    discountError.style.color = "red";
    return false;
  } else {
    discountInput.style.border = "2px solid #39ff14";
    return true;
  }
}

function validateLimit() {
  var limit = document.getElementById("limit").value.trim();
  var limitInput = document.getElementById("limit");
  var limitError = document.getElementById("limitError");
  limitError.innerHTML = "";
  const errors = [];

  if (limit=="") {
    errors.push("Please enter the Limit");
  }
  if (isNaN(limit) || parseInt(limit) < 0) {
    errors.push("Usage limit must be a non-negative number");
  }

  if (errors.length > 0) {
    limitInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      limitError.appendChild(errorSpan);
      limitError.appendChild(document.createElement("br")); // Add line break between errors
    });
    limitError.style.color = "red";
    return false;
  } else {
    limitInput.style.border = "2px solid #39ff14";
    return true;
  }
}

function validateExpiry() {
  var expiry = document.getElementById("expiry").value.trim();
  var expiryInput = document.getElementById("expiry");
  var expiryError = document.getElementById("expiryError");
  expiryError.innerHTML = "";
  const errors = [];

  if (expiry === "") {
    errors.push("Expiry date is required");
  } else {
    const currentDate = new Date();
    const expiryDate = new Date(expiry);
    if (expiryDate < currentDate) {
      errors.push("Expiry date must be in the future");
    }
  }

  if (errors.length > 0) {
    expiryInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      expiryError.appendChild(errorSpan);
      expiryError.appendChild(document.createElement("br")); // Add line break between errors
    });
    expiryError.style.color = "red";
    return false;
  } else {
    expiryInput.style.border = "2px solid #39ff14";
    return true;
  }
}

function validateMinAmt() {
  var minAmt = document.getElementById("minAmt").value.trim();
  var minAmtInput = document.getElementById("minAmt");
  var minAmtError = document.getElementById("minAmtError");
  minAmtError.innerHTML = "";
  const errors = [];

  if (minAmt=="") {
    errors.push("Please Enter the minimum amount");
  }
  if (isNaN(minAmt) || parseFloat(minAmt) < 0) {
    errors.push("Minimum amount must be a non-negative number");
  }

  if (errors.length > 0) {
    minAmtInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      minAmtError.appendChild(errorSpan);
      minAmtError.appendChild(document.createElement("br")); // Add line break between errors
    });
    minAmtError.style.color = "red";
    return false;
  } else {
    minAmtInput.style.border = "2px solid #39ff14";
    return true;
  }
}

function validateMaxAmt() {
  var maxAmt = document.getElementById("maxAmt").value.trim();
  var maxAmtInput = document.getElementById("maxAmt");
  var maxAmtError = document.getElementById("maxAmtError");
  maxAmtError.innerHTML = "";
  const errors = [];

  if (maxAmt=="") {
    errors.push("Please Enter the Maxmum amount");
  }
  if (isNaN(maxAmt) || parseFloat(maxAmt) < 0) {
    errors.push("Maximum amount must be a non-negative number");
  }

  if (errors.length > 0) {
    maxAmtInput.style.border = "2px solid red";
    errors.forEach((error) => {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = error;
      maxAmtError.appendChild(errorSpan);
      maxAmtError.appendChild(document.createElement("br")); // Add line break between errors
    });
    maxAmtError.style.color = "red";
    return false;
  } else {
    maxAmtInput.style.border = "2px solid #39ff14";
    return true;
  }
}

document.getElementById("couponForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const isCodeValid = validateCode();
  const isDiscountValid = validateDiscount();
  const isLimitValid = validateLimit();
  const isExpiryValid = validateExpiry();
  const isMinAmtValid = validateMinAmt();
  const isMaxAmtValid = validateMaxAmt();

  if (isCodeValid && isDiscountValid && isLimitValid && isExpiryValid && isMinAmtValid && isMaxAmtValid) {
    sendRequest();
  } else {

    load()
  }
});
function load (){
document.getElementById("couponForm").addEventListener("change", () => {
  validateCode();
  validateDiscount();
  validateLimit();
  validateExpiry();
  validateMinAmt();
  validateMaxAmt();
});
}
async function sendRequest() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/admin/coupons/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'An error occurred');
    }

    console.log(result); // Handle successful creation response
    window.toast.success("Successfully added");
    // window.location.href = "/admin/coupons";
  } catch (error) {
    console.error('Error:', error);
    window.toast.errorMessage(error.message);
    window.location.href('/admin/coupons')
    // If you want to display the error in a specific element:
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.textContent = error.message;
      errorElement.style.display = 'block';
    }
  }
}

 const urlPath = window.location.pathname; 
const segments = urlPath.split('/');
  const couponId = segments[3]
if (couponId!='create'){

const dateis = document.getElementById('expiry')
dateis.addEventListener('click',()=>  {
  dateis.type='date'
})
document.getElementById('couponForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = `/admin/coupons/${couponId}/edit`;

  const couponData = {
    code: document.getElementById('code').value,
    discount: document.getElementById('discount').value,
    limit: document.getElementById('limit').value,
    expiry: document.getElementById('expiry').value,
    minAmt: document.getElementById('minAmt').value,
    maxAmt: document.getElementById('maxAmt').value
  };

  try {
    const response = await axios.patch(url, couponData);
    if (response.status === 200) {
      alert('Coupon updated successfully!');

      window.location.href='/admin/coupons'
    } else {
      alert('Failed to update the coupon. Please try again.');
    }
  } catch (error) {
    console.error('Error updating coupon:', error);
    window.toast.error(error)
  }
});


}
