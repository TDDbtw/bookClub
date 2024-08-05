const namePattern = /^[a-zA-Z\s-]+$/;
function editCatVal() {

  const offerSelect=document.querySelector('.offerSelect')
  const catId = document.getElementById('catId').value;
  const name = document.getElementById('cName').value;
  const des = document.getElementById('dName').value;
  const image = document.getElementById('file-input').files[0];
  const sub = document.querySelectorAll('#subcategory-list input[type="text"]');
  const cancelButton = document.querySelector('.btn-secondary');
  const fileInput = document.querySelector('#file-input');
  let offer =  offerSelect.value? offerSelect.value: offerSelect.placeholder;
   if (offer=='Remove offer'){ 
    offer=null
   }


console.log(`offer is the ${offer}`)
  // Validation flags
  let isValid = true;

  // Clear previous error messages
  document.getElementById('nameError').innerText = '';
  document.getElementById('descriptionError').innerText = '';
  document.getElementById('subcategoryError').innerText = '';

  // Validate category name
  if (name.length === 0) {
    document.getElementById('nameError').innerText = 'Category name is required.';
    isValid = false;
  }
  else if (name!= name.trim()) {
    document.getElementById('nameError').innerText = "Category name Cant be start with a space";
    isValid = false;
  }

  else if (!namePattern.test(name)) {
    document.getElementById('nameError').innerText = "Enter a valid Category Name ";
    isValid = false;
  }
  // Validate description
  if (des.length === 0) {
    document.getElementById('descriptionError').innerText = 'Description is required.';
    isValid = false;
  }
  else if (des!= des.trim()) {
    document.getElementById('descriptionError').innerText = "Description Cant be start with a space";
    isValid = false;
  }
  // Validate image upload

  if (!image && !document.getElementById('catImg').src) {
    document.getElementById('subcategoryError').innerText = 'Please upload an image.';
    isValid = false;
  }

  // Validate subcategory inputs
  let hasEmptySubcategory = false;
  sub.forEach(input => {
    if (input.value.trim().length === 0) {
      hasEmptySubcategory = true;
    }
  });
  if (hasEmptySubcategory) {
    document.getElementById('subcategoryError').innerText = 'Please enter a name for all subcategories or remove empty ones.';
    isValid = false;
  }

  // If all validations pass, submit the form
  if (isValid) {
    // Gather subcategory data
    const subcategories = Array.from(sub).map(input => input.value.trim()).filter(value => value !== "");

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", des);
    formData.append("subcategories", JSON.stringify(subcategories));
    formData.append("offer", offer);

    // Append image file if selected
    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    // Send Axios request
    axios.patch(`/admin/category/${catId}/edit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        window.toast.success("Category updated successfully");
        console.log("Category updated successfully:", response.data);
        window.location = "/admin/category"; // Redirect after success
      })
      .catch((error) => {
        window.toast.error(error);
        console.error("Error updating category:", error);
      });
  }
}

// Add event listener to the form
document.getElementById('categoryForm').addEventListener('submit', editCatVal);

// Cancel button logic
document.querySelector('.btn-secondary').addEventListener('click', () => {
  window.location = "/admin/category"; // Redirect to category list
});
