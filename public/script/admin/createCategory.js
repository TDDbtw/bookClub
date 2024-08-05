document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".main-content form");
  const cancelButton = document.querySelector(".buttons .cancel");
  const addButton = document.querySelector(".buttons .add-category");
  const fileInput = document.querySelector("#file-input");
  const imageContainer = document.getElementById("image-container");
  const addSubcategoryButton = document.querySelector(".add-subcategory");
  const subcategoryList = document.querySelector(".subcategory-list");
const imagePlaceholder = document.getElementById('image-placeholder');

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePlaceholder.style.display = 'none';
      const img = document.createElement('img');
      img.id = 'catImg';
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      imageContainer.appendChild(img);
    }
    reader.readAsDataURL(file);
  }
});
  // Add Subcategory Input Field

document.querySelector('.add-subcategory').addEventListener('click', function() {
  const subcategoryList = document.getElementById('subcategory-list');
  const newSubcategoryItem = document.createElement('div');
  newSubcategoryItem.classList.add('subcategory-item');
  newSubcategoryItem.innerHTML = `
    <input type="text" class="form-control" name="subcategories[]" placeholder="Enter subcategory name">
    <button type="button" class="btn btn-outline-danger ms-2" onclick="this.parentElement.remove()">
      <i class="fas fa-trash-alt"></i>
    </button>
  `;
  subcategoryList.appendChild(newSubcategoryItem);
});


  // Category Form Submission
  addButton.addEventListener("click", function (event) {
    event.preventDefault();

    const name = document.getElementById('cName').value.trim();
    const des = document.querySelector('textarea[name="description"]').value.trim();
    const image = document.getElementById('file-input').files[0];
    const sub = document.querySelectorAll('.subcategory-list input[type="text"]');

    // Validation flags
    let isValid = true;

    // Clear previous error messages
    document.getElementById('nameError').innerText = '';
    document.getElementById('descriptionError').innerText = '';
    document.getElementById('thumbnailError').innerText = '';
    document.getElementById('subCategoryError').innerText = '';

    // Validate category name
    if (name.length === 0) {
      document.getElementById('nameError').innerText = 'Category name is required.';
      isValid = false;
    }

    // Validate description
    if (des.length === 0) {
      document.getElementById('descriptionError').innerText = 'Description is required.';
      isValid = false;
    }

    // Validate image upload
    if (!image) {
      document.getElementById('thumbnailError').innerText = 'Please upload an image.';
      
      isValid = false;
    }

    // Validate subcategory inputs (optional)
    sub.forEach(input => {
      if (input.value.trim().length === 0) {
      document.getElementById('subCategoryError').innerText = 'add a subcategory .';
        isValid = false;
      }
    });

    // If all validations pass, you can submit the form via Ajax or perform further actions
    if (isValid) {

    // gather category name and description
    const offerSelect=document.querySelector('.offerSelect')
    const categoryName = document.getElementById('cName').value;
    const description = document.getElementById('dName').value;
    const offer =  offerSelect.value? offerSelect.value: offerSelect.placeholder;

    // Gather subcategory data
    const subcategoryInputs = document.querySelectorAll(
      'input[name="subcategories[]"]'
    );
    const subcategories = [];
    subcategoryInputs.forEach((input) => {
      if (input.value.trim() !== "") {
        subcategories.push(input.value.trim());
      }
    });

    // Create FormData object
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", description);
    formData.append("subcategories", JSON.stringify(subcategories)); // Add subcategories
    formData.append("offer", offer);
    // Append image file if selected
    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    // Send Axios request
    axios
      .post("/admin/category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Category added successfully:", response.data);
        console.log("Category added successfully:", response.data);
        // Reset form and image container
        window.location = "/admin/category"; // Redirect after success
      })
      .catch((error) => {
document.getElementById('error').innerHTML=""
document.getElementById('error').style.color="red"
        console.log(error);
document.getElementById('error').innerHTML=error.response.data.error
        // Handle errors appropriately (e.g., display error message to the user)
      });
    }
  // Cancel Button Logic
  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.reset();
    imageContainer.innerHTML = "";
}
 
)})})
