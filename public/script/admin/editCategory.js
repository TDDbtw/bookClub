document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.main-content');
  const cancelButton = document.querySelector('.buttons .cancel');
  const addButton = document.querySelector('.buttons .add-category');
  const fileInput = document.querySelector('#file-input');
  const imageContainer = document.getElementById('image-container');
  const catId = document.getElementById('catId').value;

  fileInput.addEventListener('change', function() {
    imageContainer.innerHTML = ''; // Clear previous images
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'uploaded-image';
        img.style.width = '92px';
        imageContainer.appendChild(img);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  addButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Gather form data
    const categoryName = form.querySelector('input[name="name"]').value;
    const description = form.querySelector('textarea[name="description"]').value;
console.log(`${categoryName}`)
console.log(`${description}`)
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', description);

    if (fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }

    // Make the Axios request
    axios.patch(`/admin/category/${catId}/edit`, formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Category added successfully:', response.data);
      alert('Category added successfully:');
      window.location.href = "/admin/category"
      // Optionally reset the form and clear the image container after success
      // form.reset();
    // window.location = "/admin/category"
    })
    .catch(error => {
      console.error('There was an error adding the category:', error);
      // Optionally handle the error, e.g., display an error message
    });
  });

  cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Clear form data and the image container
    form.reset();
    imageContainer.innerHTML = '';
  });
});
