
  console.log('order update running');

  async function handleCancelOrder(orderId) {
  const result = await window.confirmationModal.confirmDelete('Cancel Order', 'Are you sure you want to cancel this order?');
  if (result.isConfirmed) {
    try {
      const response = await axios.put(`/order/${orderId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        window.toast.success('Order cancelled successfully');
        location.reload();
      } else {
        window.toast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  }

  async function handleReturnOrder(orderId) {
  const result = await window.confirmationModal.return('Return Product', 'Are you sure you want to return this Order?');
  if (result.isConfirmed) {
    try {
      const response = await axios.put(`/order/${orderId}/return`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        window.toast.success('Order Return Requested');
        location.reload();
      } else {
        window.toast.error(response.data.message || 'Failed to return order');
      }
    } catch (error) {
      console.error('Error:', error);
      window.toast.error(error)
    }
  }
  }
async function handleCancelProduct(orderId, productId) {
  const result = await window.confirmationModal.confirmDelete('Cancel Product', 'Are you sure you want to cancel this product?');
  
  if (result.isConfirmed) {
    try {
      const response = await axios.put(`/order/${orderId}/product/${productId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.success) {
        window.toast.success('Product cancel request added successfully');
        location.reload();
      } else {
        window.toast.error(response.data.message || 'Failed to cancel product');
      }
    } catch (error) {
      console.error('Error:', error);
      errorToast(error);
    }
  }
}


  async function handleReturnProduct(orderId, productId) {
  const {value: text} = await window.confirmationModal.return('Return Product', 'Are you sure you want to return this product?');
  if (text) {
    try {
      const response = await axios.put(`/order/${orderId}/product/${productId}/return`, {reason:text}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        location.reload();
        window.toast.success('Product return request added successfully')
      } else {
        window.toast.error(response.data.message || 'Failed to return product');
      }
    } catch (error) {
      console.error('Error:', error);
      errorToast(error)
    }
  }}

async function handleInvoice(orderId) {
  const result = await window.confirmationModal.show('generate invoice Product', 'Are you sure you want to generate invoice of this order?t');
  
  if (result.isConfirmed) {
    try {
      const response = await axios.get(`/order/${orderId}/invoice`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.success) {
        window.toast.success('invoice generate successfully');
        location.reload();
      } else {
        window.toast.error(response.data.message || 'Failed to cancel product');
      }
    } catch (error) {
      console.error('Error:', error);
      errorToast(error);
    }
  }
}
