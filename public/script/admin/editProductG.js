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
  const offerSelect = document.querySelector('.offerSelect');

  function getFormData() {
    const formData = new FormData();
    formData.append('name', nameInput.value || nameInput.placeholder);
    formData.append('author', authorInput.value || authorInput.placeholder);
    formData.append('description', descriptionInput.value || descriptionInput.placeholder);
    formData.append('price', priceInput.value || priceInput.placeholder);
    formData.append('stockCount', stockCountInput.value || stockCountInput.placeholder);
    formData.append('category', categorySelect.value || categorySelect.placeholder);
    formData.append('subcategory', subCategorySelect.value || subCategorySelect.placeholder);
    formData.append('offer', offerSelect.value == 'No Offer' || offerSelect.value == 'Remove Offer' ? 'none' : offerSelect.value);

    const imageFiles = document.getElementById('file-input').files;
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('image', imageFiles[i]);
      }
    }
    return formData;
  }

  async function sendRequest() {
    if (!validateProduct()) {
      window.toast.error('Please fix the errors before submitting');
      return;
    }

    const productId = JSON.parse(productValInput.value)._id;
    const url = `/admin/products/${productId}/edit`;

    try {
      const formData = getFormData();
      const response = await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        window.toast.success('Product updated successfully');
        setTimeout(() => {
          window.location.href = "/admin/products";
        }, 1000);
      } else {
        window.toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      window.toast.error('An error occurred while updating the product. Please try again.');
    }
  }

  saveButton.addEventListener('click', function (event) {
    event.preventDefault();
    sendRequest();
  });
});

const catS = document.getElementById('catSelect');
const subcatSelect = document.getElementById('category');
let subcategories = JSON.parse(document.getElementById('ss').value);

catS.addEventListener('change', function() {
  const selectedCategoryId = catS.value;
  
  subcatSelect.innerHTML = '';
  
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = 'Select a subcategory';
  subcatSelect.appendChild(defaultOption);
  
  subcategories.forEach(subcategory => {
    if (subcategory.category._id === selectedCategoryId) {
      const option = document.createElement('option');
      option.value = subcategory._id;
      option.textContent = subcategory.name;
      subcatSelect.appendChild(option);
    }
  });

  validateProduct();
});
