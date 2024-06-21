
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
    formData.append('name', nameInput.value);
    formData.append('author', authorInput.value);
    formData.append('description', descriptionInput.value);
    formData.append('price', priceInput.value);
    formData.append('stockCount', stockCountInput.value);
    formData.append('category', categorySelect.value);
    formData.append('subcategory', subCategorySelect.value);

    // Add images if any
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('images', fileInput.files[i]);
    }

    return formData;
  }

  async function sendRequest() {
    const productId = JSON.parse(productValInput.value)._id;
    const url =`/admin/products/${productId}/edit`

    try {
      const formData = getFormData();
      const response = await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        alert('Product updated successfully');
        // Optionally, redirect to another page or update the UI
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
