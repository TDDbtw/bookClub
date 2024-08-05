console.log(`coupon running`);

const removeCouponBtn = document.getElementById('removeCouponBtn');
const clearCouponBtn = document.getElementById('clearCouponBtn');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const couponCodeInput = document.getElementById('couponCode');
const userInput = document.getElementById('userInput');
const totalAmountInput = document.getElementById('totalAmountInput');
const tA = document.getElementById('totalAmount');
const discountAmount = document.getElementById('discountAmount');
const couponError = document.getElementById('couponError');

removeCouponBtn.style.display = 'none';
clearCouponBtn.style.display = 'none';

const couponResult = {};

const updateDisplay = (discount, newTotal, message, messageColor, showApplyBtn, showClearBtn, showRemoveBtn) => {
  if (discount !== undefined) discountAmount.innerHTML = `$${discount.toFixed(2)}`;
  if (newTotal !== undefined) {
    tA.innerHTML = `$${newTotal.toFixed(2)}`;
    totalAmount.value = newTotal.toFixed(2);
  }
  if (message !== undefined) {
    couponError.textContent = message;
    couponError.style.color = messageColor;
  }
  applyCouponBtn.style.display = showApplyBtn ? 'block' : 'none';
  clearCouponBtn.style.display = showClearBtn ? 'block' : 'none';
  removeCouponBtn.style.display = showRemoveBtn ? 'block' : 'none';
};

applyCouponBtn.addEventListener('click', async () => {
  const couponCode = couponCodeInput.value;
  let user = JSON.parse(userInput.value)._id;
  const cart = totalAmountInput.value;

  try {
    const response = await axios.post('/order/applyCoupon', { couponCode, user, cart });

    if (response.data.success) {
      couponResult.discount = response.data.discount;
      couponResult.couponCode = couponCode;
      couponResult.newTotalAmount = response.data.newTotal;
      couponResult.totalAmountInput = response.data.newTotal+couponResult;

      updateDisplay(
        response.data.discount,
        response.data.newTotal,
        'Coupon applied successfully!',
        'green',
        false,
        false,
        true
      );
    } else {
      window.toast.error('bad');
    }
  } catch (error) {
    console.error(error);
    updateDisplay(
      undefined,
      undefined,
      error.response.data.message,
      'red',
      false,
      true,
      false
    );
  }
});

clearCouponBtn.addEventListener('click', function () {
  couponCodeInput.value = '';
  updateDisplay(undefined, undefined, '', '', true, false, false);
});

removeCouponBtn.addEventListener('click', async () => {
  const couponCode = couponResult.couponCode;
  let user = JSON.parse(userInput.value)._id;

  try {
    const response = await axios.post('/order/removeCoupon', { couponCode, user });

    if (response.data.success) {
      couponResult.discount = 0;
      couponResult.couponCode = '';
      couponResult.newTotalAmount = response.data.originalTotal;
      couponResult.totalAmountInput = response.data.originalTotal-couponResult;

      updateDisplay(
        0,
        response.data.originalTotal,
        'Coupon removed successfully!',
        'green',
        true,
        false,
        false
      );
    } else {
      window.toast.error('bad');
    }
  } catch (error) {
    console.error(error);
    updateDisplay(
      undefined,
      undefined,
      error.response.data.message,
      'red',
      false,
      false,
      true
    );
  }
});
