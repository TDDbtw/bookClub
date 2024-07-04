document.getElementById('offerForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const offerData = {
                offerName: document.getElementById('offerName').value,
                discountType: document.getElementById('discountType').value,
                discountValue: document.getElementById('discountValue').value,
                maximumAmount: document.getElementById('maximumAmount').value,
                discountOn: document.getElementById('discountOn').value,
                startDate: document.getElementById('startDate').value,
                expiryDate: document.getElementById('expiryDate').value,
            };

            axios.post('/api/offers', offerData)
                .then(response => {
                    alert('Offer added successfully!');
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('There was an error adding the offer!', error);
                });
        });
