console.log(`toast is running`)
// public/javascripts/toast.js


class Toast {
  constructor(options = {}) {
    this.defaultOptions = {
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "center",
      stopOnFocus: true,
      ...options
    };
  }

  show(message, type = 'default') {
    const options = { ...this.defaultOptions };

    switch (type) {
  case 'success':
    options.style = { background: "linear-gradient(to right top, #00ff00, #00f800, #00f100, #00ea00, #00e300, #00de00, #00da00, #00d500, #00d100, #00cd00, #00ca00, #00c600)" };
    break;
  case 'error':
    options.style = { background: "linear-gradient(to right top, #ff0000, #f80000, #f10000, #ea0000, #e30000, #de0000, #da0000, #d50000, #d10000, #cd0000, #ca0000, #c60000)" };
    break;
  case 'info':
    options.style = { background: "linear-gradient(to right top, #0000ff, #0000f8, #0000f1, #0000ea, #0000e3, #0000de, #0000da, #0000d5, #0000d1, #0000cd, #0000ca, #0000c6)" };
    break;
  case 'warning':
    options.style = { background: "linear-gradient(to right top, #ffa500, #f8a000, #f19b00, #ea9600, #e39100, #de8c00, #da8700, #d58200, #d17d00, #cd7800, #ca7300, #c66e00)" };
    break;
  case 'errorMessage':
    options.style = { background: "linear-gradient(to right top, #ff0000, #f80000, #f10000, #ea0000, #e30000, #de0000, #da0000, #d50000, #d10000, #cd0000, #ca0000, #c60000)" };
    break;
  default:
    options.style = { background: "linear-gradient(to right top, #808080, #7a7a7a, #747474, #6e6e6e, #686868, #636363, #5e5e5e, #595959, #545454, #4f4f4f, #4a4a4a, #454545)" };
} 

    Toastify({
      text: message,
      ...options
    }).showToast();
  }

  success(message) {
    this.show(message, 'success');
  }

  error(error) {
    this.show( error);
  }

  errorMessage(message) {
    this.show(message,'errorMessage');
  }
  info(message) {
    this.show(message, 'info');
  }

  warning(message) {
    this.show(message, 'warning');
  }
}

// Create a global instance
window.toast = new Toast();
