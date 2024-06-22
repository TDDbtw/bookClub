
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
    const formData = {};
    formData.name= nameInput.value? nameInput.value: nameInput.placeholder;
    formData.author= authorInput.value? authorInput.value: authorInput.placeholder;
    formData.description= descriptionInput.value? descriptionInput.value: descriptionInput.placeholder;
    formData.price= priceInput.value? priceInput.value: priceInput.placeholder;
    formData.stockCount= stockCountInput.value? stockCountInput.value: stockCountInput.placeholder;
    formData.category= categorySelect.value? categorySelect.value: categorySelect.placeholder;
    formData.subcategory= subCategorySelect.value? subCategorySelect.value: subCategorySelect.placeholder;

    // Add images if any
    
const imageFiles = document.getElementById('file-input').files;
    let list = []
if (imageFiles.length > 0) {
  for (let i = 0; i < imageFiles.length; i++) {
    list.push(imageFiles[i])
  }
}
formData.image=list
    return formData;
  }

  async function sendRequest() {
    const productId = JSON.parse(productValInput.value)._id;
    const url =`/admin/products/${productId}/edit`

    try {
      const body = getFormData();
      const response = await axios.patch(url, body, {
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
