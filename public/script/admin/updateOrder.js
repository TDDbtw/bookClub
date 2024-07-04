console.log(`admin order update running`)
    document.addEventListener('DOMContentLoaded', function () {
      const saveButton = document.getElementById('statusSave');
      const statusSelect = document.getElementById('statusSelect');
      const orderId = statusSelect ? statusSelect.dataset.id : null;
      
      if (saveButton && statusSelect && orderId) {
      saveButton.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default behavioooif the anchor tag
              // Get the selected status from the dropdown
            const selectedStatus = statusSelect.value;
            console.log(selectedStatus);

            // Fetch PUT request
            fetch(`/admin/orders/${orderId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: selectedStatus }),
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              // Handle successful response
              window.location.href = "/admin/orders";
            })
            .catch(error => {
              // Handle error
              console.error('There was a problem with the fetch operation:', error);
            });
          });
        }
      const returnButtons = document.querySelectorAll('.return-button');
      returnButtons.forEach(button => {
        button.addEventListener('click', function () {
          const productId = this.dataset.id;
          const orderId = document.getElementById('productReturn').value;
          console.log(`Accepting return for product ID: ${productId}`);
          console.log(`Accepting return for order ID: ${orderId}`);

          axios.patch(`/admin/order/${orderId}/${productId}/return`)
            .then(response => {
             successToast('product return approved') 
              window.location.href = `/admin/orders/${orderId}`;
            })
            .catch(error => {
              // Handle error
            errorToast(error)
              console.error('There was a problem with the Axios operation:', error);
            });
        });
      });
    });



        document.getElementById('orderReturnBtn').addEventListener('click', function () {
          const orderId = document.getElementById('orderReturnBtn').getAttribute('data-id')
          console.log(`Accepting return for order ID: ${orderId}`);

          axios.patch(`/admin/order/${orderId}/return`)
            .then(response => {
             successToast('product return approved') 
              window.location.href = `/admin/orders/${orderId}`;
            })
            .catch(error => {
              // Handle error
            errorToast(error)
              console.error('There was a problem with the Axios operation:', error);
            });
        });
