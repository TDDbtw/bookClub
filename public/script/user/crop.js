document.getElementById('input1').addEventListener('change', function (event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let dataURL = reader.result;
    let image = document.getElementById('imgView1');
    image.src = dataURL;

    // Initialize Cropper.js on the image
    let cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 2,
      guides: true,
      background: false,
      autoCropArea: 1,
      zoomable: true,
    });

    // Show the image cropper container
    let cropperContainer = document.querySelector('.image-cropper');
    cropperContainer.style.display = 'block';
    // document.querySelector('#croppedImg1').style.display = 'none';
    // Update the cropped image when the "Save" button is clicked
    let saveButton = document.getElementById('saveButton1');
    saveButton.addEventListener('click', function () {
      // Get the cropped canvas data

      const canvas = cropper.getCroppedCanvas();

      if (!canvas) {
        return;
      }

      // Convert the canvas to a Blob (in this case, to a JPEG file with quality 1.0)
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('croppedImage', blob, 'cropped-image.jpg');



        // Submit the form data to the backend using Fetch API or XMLHttpRequest
        fetch('/user/profile/update', {
          method: 'PATCH',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              alert("photo updated successfully")
              window.location.reload();
              
            } else {
              console.error('Failed to submit cropped image.');
              // Optionally, handle failed submission
            }
          })
          .catch(error => {
            console.error('Error submitting cropped image:', error);
          });
      }, 'image/jpeg'); // Set the desired image format here
    });
  };
  reader.readAsDataURL(input.files[0]);
});
