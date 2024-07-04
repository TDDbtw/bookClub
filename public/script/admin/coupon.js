
function errorToast(error) {
    Toastify({
        text: error.response.data.error,
        duration: 3000, 
      gravity: 'bottom', 
      backgroundColor: '#ff3333', 
    }).showToast();
}
function successToast(message) {
    Toastify({
        text: message,
        duration: 3000, 
      gravity: 'bottom', 
      backgroundColor: '#33cc33', 
    }).showToast();
}
const dateis = document.getElementById('expiry')
dateis.addEventListener('click',()=>  {
  dateis.type='date'
})
const form = document.getElementById('couponForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await fetch('/admin/coupons/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      successToast('Coupon created successfully!')
      window.location.href='/admin/coupons'
    } else {
      console.error('Error creating coupon:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
 const urlPath = window.location.pathname; 
const segments = urlPath.split('/');
  const couponId = segments[3]
if (couponId!='create'){
document.getElementById('couponForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = `/admin/coupons/${couponId}/edit`;

  const couponData = {
    code: document.getElementById('code').value,
    discount: document.getElementById('discount').value,
    limit: document.getElementById('limit').value,
    expiry: document.getElementById('expiry').value,
    minAmt: document.getElementById('minAmt').value,
    maxAmt: document.getElementById('maxAmt').value
  };

  try {
    const response = await axios.patch(url, couponData);
    if (response.status === 200) {
      successToast('Coupon updated successfully!');

      window.location.href='/admin/coupons'
    } else {
      alert('Failed to update the coupon. Please try again.');
    }
  } catch (error) {
    console.error('Error updating coupon:', error);
    errorToast(error)
  }
});






}
