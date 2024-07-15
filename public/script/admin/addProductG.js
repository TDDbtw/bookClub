const nameError = document.getElementById('nameError')
nameError.style.color="red"
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


async function sendRequest () {
  nameError.innerHTML=""
  authorError.innerHTML=""
  descriptionError.innerHTML=""
  imageError.innerHTML=""
  priceError.innerHTML=""
  stockCountError.innerHTML=""
  subcategoriesError.innerHTML=""
  categoriesError.innerHTML=""
  const formData = new FormData(); // Assuming you're using FormData for file uploads

  formData.append('name', document.getElementById('name').value);
  formData.append('author', document.getElementById('author').value);
  formData.append('description', document.getElementById('description').value);

  // Handle file upload (replace with your specific logic)
const imageFiles = document.getElementById('file-input').files;
if (imageFiles.length > 0) {
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('image', imageFiles[i]);
  }
}

  formData.append('price', document.getElementById('price').value);
  formData.append('stockCount', document.getElementById('stockCount').value);

  // Handle category and subcategory selection (replace with your data)
  const selectedCategoryId = document.querySelectorAll('.category');
  const selectedSubcategoryIds = []; // Assuming you have logic to collect selected subcategories
console.log(`${JSON.stringify(selectedCategoryId)}`)
  formData.append('category',document.getElementById('catSelect').value);
  formData.append('subcategories',document.getElementById('category').value ); // Assuming server expects an array of subcategory IDs

  // Additional server-specific fields (if any)
  // formData.append('auth_token', yourAuthToken); // Example

 await axios.post('/admin/products/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Important for file uploads
    }
  })
    .then(response => {
      console.log(response.data); // Handle successful creation response
      window.toast.success("sucessfully added")
window.location.href = "/admin/products"
    })
    .catch(error => {
     console.log(`${error}`) 
      if(error.response.data.errors && error.reponse.data.errors.length<2){
      }// Handle errors
      if(error.response.data.errors && error.reponse.data.errors.length>2){ // Handle errors
        items=error.response.data.errors
        displayErrors(items);
      }
    });
  function displayErrors(errors) {
    errors.forEach(error => {
      const errorSpanId = `${error.path}Error`; // Construct error span ID
      const errorSpan = document.getElementById(errorSpanId);

      if (errorSpan) { // Check if the error span exists

        const item = document.createElement('span');
        item.textContent = error.msg
        item.style.color = 'red'; // Display the error span
        errorSpan.appendChild(item); // Set the error message
        errorSpan.style.display = 'grid'; // Display the error span
        errorSpan.style.marginTop = '4px'; // Display the error span
      } else {
        console.warn(`Error span with ID "${errorSpanId}" not found.`);
      }
    });
  }
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
