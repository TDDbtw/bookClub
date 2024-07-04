
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#mainContent');
  const saveButton = document.getElementById('save-product');
  const nameInput = document.querySelector('#name');
  const authorInput = document.querySelector('#author');
  const descriptionInput = document.querySelector('#description');
  const priceInput = document.querySelector('#price');
  const stockCountInput = document.querySelector('#stockCount');
  const categorySelect = document.querySelector('#catSelect');
  const subCategorySelect = document.querySelector('#category');
  const fileInput = document.querySelector('#file-input');
  const productValInput = document.querySelector('#productVal');

  function getFormData() {
    const formData = new FormData();
    formData.append('name', nameInput.value? nameInput.value: nameInput.placeholder);
    formData.append('author', authorInput.value? authorInput.value: authorInput.placeholder);
    formData.append('description', descriptionInput.value? descriptionInput.value: descriptionInput.placeholder);
    formData.append('price', priceInput.value? priceInput.value: priceInput.placeholder);
    formData.append('stockCount', stockCountInput.value? stockCountInput.value: stockCountInput.placeholder);
    formData.append('category', categorySelect.value? categorySelect.value: categorySelect.placeholder);
    formData.append('subcategory', subCategorySelect.value? subCategorySelect.value: subCategorySelect.placeholder);

    // Add images if any

const imageFiles = document.getElementById('file-input').files;
if (imageFiles.length > 0) {
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('image', imageFiles[i]);
  }
}
    return formData;
  }

  async function sendRequest() {
    const productId = JSON.parse(productValInput.value)._id;
    const url =`/admin/products/${productId}/edit`

    try {
      const formData = getFormData();
console.log(`form data is --- ${JSON.stringify(formData)}`)
      const response = await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        alert('Product updated successfully');
        // Optionally, redirect to another page or update the UI
        ///admin/products
        window.location.href = "/admin/products";
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product. Please try again.');
    }
  }

  saveButton.addEventListener('click', function (event) {
    event.preventDefault();
    sendRequest();
  });
});

const catS = document.getElementById('catSelect');
const subcatSelect = document.getElementById('category');
let subcategories = document.getElementById('ss').value; // Assuming subcategories is populated somewhere
subcategories=JSON.parse(subcategories)
console.log(`${subcategories}`)
// Event listener for catSelect change event
catS.addEventListener('change', function() {
  const selectedCategoryId = catS.value;
  
  // Clear existing options
  subcatSelect.innerHTML = '';
  
  // Add default disabled option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = 'Select a subcategory';
  subcatSelect.appendChild(defaultOption);
  
console.log(`${subcategories}`)
  // Filter subcategories based on selected category
  subcategories.forEach(subcategory => {
    if (subcategory.category._id === selectedCategoryId) {
      const option = document.createElement('option');
      option.value = subcategory._id;
      option.textContent = subcategory.name;
      subcatSelect.appendChild(option);
    }
  });
});
console.log('running')
