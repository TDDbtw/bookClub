
let productVal = document.getElementById('productVal').value; // Assuming subcategories is populated somewhere
productVal=JSON.parse(productVal)
console.log(`product val is${productVal._id}`)
const productId=productVal._id
const nameError = document.getElementById('nameError')
const authorError = document.getElementById('nameError')
const descriptionError = document.getElementById('descriptionError')
const imageError = document.getElementById('imageError')
const priceError = document.getElementById('priceError')
const stockCountError = document.getElementById('stockCountError')
const subcategoriesError=document.getElementById('subCategoryError')
const categoriesError=document.getElementById('categoryError')
const button = document.getElementById('save-product');


const catSelect = document.getElementById('catSelect');

catSelect.addEventListener('change', function() {
  console.log(`${catSelect.value}`);
});


function sendRequest() {
  const name = document.getElementById('name').value;
  const author = document.getElementById('author').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const stockCount = document.getElementById('stockCount').value;
  const category = document.getElementById('catSelect').value;
  const subcategories = Array.from(document.getElementsByClassName('subcatSelect')).map(select => select.value);
  const images = Array.from(document.getElementById('file-input').files);

  const formData = new FormData();
  formData={'name': name}
  formData.append('author', author);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('stockCount', stockCount);
  formData.append('category', category);
  subcategories.forEach(subcategory => formData.append('subcategories', subcategory));
  images.forEach(image => formData.append('image', image));
  console.log(`${JSON.stringify(formData)}`)
  axios.post(`/admin/products/${productId}/edit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log('Product updated successfully:', response.data);
      alert('Product updated successfully!');

        window.location.href = "/admin/products"
      // Redirect or update the page as needed
    })
    .catch(error => {
      console.error('There was an error updating the product:', error);
      alert('Error updating product. Please try again.');
    });
}














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
  defaultOption.value = `productVal.subcategories[0]`;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = productVal.subcategories[0].name

  subcatSelect.appendChild(defaultOption);

  console.log(`product val is${productVal.subcategories[0].name}`)
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


document.getElementById('file-input').addEventListener('change', function() {
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = ''; // Clear previous images
  if (this.files) {
    for (let file of this.files) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'uploaded-image';
        img.style.width = '92px'
        imageContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
});


async function handleImg(event) {
  const productId = event.target.dataset.productId;

  try {
    const response = await axios.delete(`/cart/remove/${productId}`); // Adjust route if needed
    if (response.status === 200) {
      // Remove item from the table and update cart total
      event.target.closest('tr').remove();
      updateCartTotal(response.data); // Assuming the response includes the updated cart
    } else {
      console.error('Failed to remove item:', response.status);
      alert('Failed to remove item from cart.');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    alert('An error occurred while removing the item.');
  }
}

  const removeButtons = document.querySelectorAll('.remove-image');

  removeButtons.forEach(button => {
    button.addEventListener('click', handleImg);
  });
