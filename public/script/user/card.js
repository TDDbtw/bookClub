console.log(`card running`)
document.getElementById('cardForm').addEventListener('submit', function(e) {
e.preventDefault()
  const form = new formData(cardForm)
console.log(form)
  axios.post('/cart/add', form)
    .then(function (response) {
      console.log('Product added to cart:', response.data);
      // Optionally, you can add more actions here, e.g., display a success message
    })
    .catch(function (error) {
      console.error('Error adding product to cart:', error);
      // Optionally, handle the error, e.g., display an error message
    });
});
