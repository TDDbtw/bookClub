 document.addEventListener("DOMContentLoaded", function() {
        const inputField = document.getElementById('amount');
        const paypalButtonContainer = document.getElementById('paypal-button-container');
                paypalButtonContainer.style.pointerEvents = 'none';
                paypalButtonContainer.style.opacity = '0.5';
        // Function to toggle PayPal button state
        const togglePayPalButton = () => {
            const inputValue = inputField.value.trim();
            if (inputValue === "") {
                document.getElementById('amountError').innerText=""
                paypalButtonContainer.style.pointerEvents = 'none';
                paypalButtonContainer.style.opacity = '0.5';
            }
          else if (isNaN(parseFloat(inputValue))) {
                paypalButtonContainer.style.pointerEvents = 'none';
                paypalButtonContainer.style.opacity = '0.5';
                inputField.style.borderColor="red"
              document.getElementById('amountError').style.color='red'
              document.getElementById('amountError').innerText="Please enter a number"
            } else {
                
                document.getElementById('amountError').innerText=""
                paypalButtonContainer.style.pointerEvents = 'auto';
                paypalButtonContainer.style.opacity = '1';
            }
        };

        inputField.addEventListener('input', togglePayPalButton);
   });
  paypal.Buttons({
    style: {
      shape: "rect",
      layout: "horizontal",
      color: "gold",
      label: "paypal",
    } ,
    createOrder: function(data, actions) {
      return fetch('/user/wallet/paypal/create-order', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          amount: document.getElementById('amount').value
        })
      }).then(function(res) {
        return res.json();
      }).then(function(orderData) {
        return orderData.id;
      });
    },
    onApprove: function(data, actions) {
      return fetch('/user/wallet/paypal/capture-order', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          orderID: data.orderID,
          amount: document.getElementById('amount').value
        })
      }).then(function(res) {
        return res.json();
      }).then(function(orderData) {
        console.log('Capture result', orderData);
        if(window.toast.success('added money to the wallet')){
          window.location.href('goolgle.com')
        }

        document.getElementById('amount').innerHTML=""
   
      });
    }
  }).render('#paypal-button-container');

document.addEventListener('DOMContentLoaded', function() {
  const transactionTable = document.querySelector('.transaction-history table tbody');
  
  function attachPaginationListeners() {
    const paginationLinks = document.querySelectorAll('.pagination-link');
    paginationLinks.forEach(link => {
      link.addEventListener('click', handlePaginationClick);
    });
  }

  function handlePaginationClick(e) {
    e.preventDefault();
    const url = this.getAttribute('href');
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTransactions = doc.querySelector('.transaction-history table tbody');
        const newPagination = doc.querySelector('.pagination');
        
        if (newTransactions) {
          transactionTable.innerHTML = newTransactions.innerHTML;
        } else {
          transactionTable.innerHTML = '<tr><td colspan="4">No transactions on this page.</td></tr>';
        }
        
        // Check if pagination container exists before updating
        const paginationContainer = document.querySelector('.pagination');
        if (paginationContainer && newPagination) {
          paginationContainer.outerHTML = newPagination.outerHTML;
        } else if (newPagination) {
          // If pagination container doesn't exist, but new pagination does, append it
          transactionTable.parentNode.insertAdjacentHTML('beforeend', newPagination.outerHTML);
        }
        
        // Update the URL without reloading the page
        history.pushState(null, '', url);
        
        // Reattach event listeners to new pagination links
        attachPaginationListeners();
      });
  }

  // Initial attachment of event listeners
  attachPaginationListeners();
});
