// public/javascripts/confirmationModal.js
console.log(`swal modal running `)
class ConfirmationModal {
  constructor(options = {}) {
    this.defaultOptions = {
      confirmButtonColor: '#2d6a4f',
      cancelButtonColor: '#6c757d',
      background: '#1b4332',
      color: '#e9f5',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      },
      ...options
    };
  }

  show(title, text, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      ...this.defaultOptions
    });
  }

  success(title, text = '') {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      ...this.defaultOptions,
      showCancelButton: false
    });
  }

  error(title, text = '') {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      ...this.defaultOptions,
      showCancelButton: false
    });
  }

  confirmDelete(title , text = "") {
    return Swal.fire({
      title,
     text,
      ...this.defaultOptions,
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
    });
  }


  return(title , text = "") {
    return Swal.fire({
      input: "textarea",
      inputLabel: "reason for return",
      inputPlaceholder: "Enter the reason here",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });
  }
  // Add more methods for different types of modals as needed
}

// Create a global instance
window.confirmationModal = new ConfirmationModal();
