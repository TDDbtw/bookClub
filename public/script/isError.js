const urlParams = new URLSearchParams(window.location.search)
const errorMessage = urlParams.get("error")
console.log(errorMessage)
if (errorMessage) {
  document.getElementById("errorMessage").innerHTML =
    decodeURIComponent(errorMessage)
}
