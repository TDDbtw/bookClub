document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.main-content');
  const cancelButton = document.querySelector('.buttons .cancel');
  const addButton = document.querySelector('.add-category');
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
editCatVal ()

  });
});
