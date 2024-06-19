console.log('running')
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('productEditForm');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stockCount = document.getElementById('stockCount').value;

    // Collecting specifications
    const specifications = [];
    document.querySelectorAll('select[name^="specifications"]').forEach((select, index) => {
      specifications.push({
        name: select.closest('tr').querySelector('th').innerText,
        value: select.value
      });
    });

    // Collecting categories
    const categories = Array.from(document.querySelectorAll('select[name="categories"]')).map(select => select.value);

    // Collecting images (existing images are displayed, not selected for upload)
    const images = Array.from(document.querySelectorAll('.smallTileImage')).map(img => img.src.split('/').pop());

    // Create the product data object
    const productData = {
      name,
      description,
      price,
      stockCount,
      specifications,
      categories,
      images
    };

        console.log( JSON.stringify(productData))
    const url = `/admin/products/${productId}/edit`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "/admin/products";
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Failed to update the product.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
});
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.remove-image').forEach((link) => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();

        const image = event.target.dataset.image;
        const index = event.target.dataset.index;

console.log(`${index}`)
        try {
          const response = await axios.delete(`/admin/products/image/${index}`);
          
          if (response.status === 200) {
            // Remove the image container from the DOM
            const imageContainer = document.getElementById(`imageContainer-${index}`);
            imageContainer.parentNode.removeChild(imageContainer);
          }
        } catch (error) {
          console.error('Error removing image:', error);
          // Optionally display an error message to the user
        }
      });
    });
  });
