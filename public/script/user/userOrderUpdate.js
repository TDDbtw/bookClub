
  console.log('order update running');

  async function handleCancelOrder(orderId) {
console.log(`order id isss ${orderId}`)
    try {
      const response = await axios.put(`/order/${orderId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        alert('Order cancelled successfully');
        location.reload();
      } else {
        alert(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleReturnOrder(orderId) {
   console.log(`ordir id is${orderId}`) 
    try {
      const response = await axios.put(`/order/${orderId}/return`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        successToast('Order return requested successfully')
        location.reload();
      } else {
        alert(response.data.message || 'Failed to return order');
      }
    } catch (error) {
      console.error('Error:', error);
      errorToast(error)
    }
  }

  async function handleCancelProduct(orderId, productId) {
    try {
      const response = await axios.put(`/order/${orderId}/product/${productId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        alert('Product cancel request added successfully');
        location.reload();
      } else {
        alert(response.data.message || 'Failed to cancel product');
      }
    } catch (error) {
      console.error('Error:', error);
     errorToast(error) 
    }
  }

  async function handleReturnProduct(orderId, productId) {
    try {
      const response = await axios.put(`/order/${orderId}/product/${productId}/return`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        successToast('Product return request added successfully')
        location.reload();
      } else {
        alert(response.data.message || 'Failed to return product');
      }
    } catch (error) {
      console.error('Error:', error);
      errorToast(error)
    }
  }
