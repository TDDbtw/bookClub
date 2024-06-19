const form = document.getElementById('productCreateForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await axios.post('/admin/products/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // If successful, redirect or do something with the response
        console.log(response.data);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errors = error.response.data.errors;

          // Display validation errors
          if (errors.name) {
            document.getElementById('nameError').textContent = errors.name;
          }
          // Handle other fields similarly
        } else {
          // Handle other types of errors
          console.error(error);
        }
      }
    });
