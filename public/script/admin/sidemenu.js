$("#header>.menu-button").click(function () {
  $("#sidemenu").toggleClass("open")
  $(".copyright").toggleClass("show")
})
$("#sidemenu, #top-bar, #content-wrapper").click(function (e) {
  $("#sidemenu").removeClass("open")
  $(".copyright").removeClass("show")
})

function errorToast(error) {
    Toastify({
        text:error.response.data.message || error.response.data.error,
        duration: 5000, 
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
