// productValidation.js
const namePattern = /^[a-zA-Z\s-]+$/;
console.log(`edit product validation`)
function validateProduct() {
  let isValid = true;
  const errors = {};

  // Validate name
  const name = document.getElementById('name').value;
  if (name === '') {
    errors.name = 'Product name is required';
    isValid = false;
  }
  else if (name!= name.trim()){
    errors.name =("Product name Cant be start with a space")
    isValid = false;
  }

  // Validate authr
  const author = document.getElementById('author').value;
  if (author === '') {
    errors.author = 'Author name is required';
    isValid = false;
  }
  else if (author!= author.trim()){
    errors.author =("Product name Cant be start with a space")
    isValid = false;
  }

    else if (!namePattern.test(author)){
    errors.author =("Enter a valid name ")
    isValid = false;
    }
  // Validate description
  const description = document.getElementById('description').value;
  if (description === '') {
    errors.description = 'Description is required';
    isValid = false;
  }

  else if (description!= description.trim()){
    errors.description =("you cant have empty spaces in the description")
    isValid = false
  }

  // Validate price
  const price = document.getElementById('price').value.trim();
  if (price === '' || isNaN(price) || parseFloat(price) <= 0) {
    errors.price = 'Please enter a valid price';
    isValid = false;
  }

  // Validate stock count
  const stockCount = document.getElementById('stockCount').value.trim();
  if (stockCount === '' || isNaN(stockCount) || parseInt(stockCount) < 0) {
    errors.stockCount = 'Please enter a valid stock count';
    isValid = false;
  }

  // Validate category
  const category = document.getElementById('catSelect').value;
  if (category === '') {
    errors.category = 'Please select a category';
    isValid = false;
  }

  // Validate subcategory
  const subcategory = document.getElementById('category').value;
  if (subcategory === '') {
    errors.subcategory = 'Please select a subcategory';
    isValid = false;
  }

  // Display errors
  Object.keys(errors).forEach(key => {
    const errorElement = document.getElementById(`${key}Error`);
    if (errorElement) {
      errorElement.style.color='red'
      errorElement.style.marginTop='4px'
      errorElement.textContent = errors[key];
    }
  });

  return isValid;
}

// Clear error messages
function clearErrors() {
  const errorElements = document.querySelectorAll('[id$="Error"]');
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

// Add input event listeners for real-time validation
document.querySelectorAll('input, textarea, select').forEach(element => {
  element.addEventListener('input', () => {
    clearErrors();
    validateProduct();
  });
});
