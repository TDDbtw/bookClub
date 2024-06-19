const Swal = require('sweetalert2');

const swallMid = {
  success: function(message, reDir) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = reDir; // Redirect to a suitable page
      }
    });
  },

  error: function(errorMessage) {
    Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#d33', // Typically, a red color for errors
      confirmButtonText: 'OK'
    });
  }
};

module.exports = {
  swallMid
};
