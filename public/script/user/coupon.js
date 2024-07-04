console.log(`coupon running`)
const couponResult={}
document.getElementById('applyCouponBtn').addEventListener('click', async () => {
      const couponCode = document.getElementById('couponCode').value;
      let user = document.getElementById('userInput').value;
      user=JSON.parse(user)
      user=user._id
      const cart = document.getElementById('totalAmountInput').value;
      try {
        const response = await axios.post('/order/applyCoupon', { couponCode, user, cart });

        if (response.data.success) {
          couponResult.discount=response.data.discount
          couponResult.couponCode=couponCode
          couponResult.newTotalAmount=response.data.newTotal
          couponResult.totalAmountInput=response.data.newTotal
          document.getElementById('discountAmount').innerHTML = `$${response.data.discount.toFixed(2)}`;
          document.getElementById('totalAmount').innerHTML = `$${response.data.newTotal.toFixed(2)}`;
          document.getElementById('totalAmountInput').value = response.data.newTotal.toFixed(2);
          document.getElementById('couponError').textContent =''
          document.getElementById('couponError').textContent = 'Coupon applied successfully!';
          document.getElementById('couponError').style.color = 'green';
        } else {
          alert('bad')
        }
      } catch (error) {
        console.error(error);
        document.getElementById('couponError').innerHTML = error.response.data.message;
        document.getElementById('couponError').style.color = 'red';
      }
    });
