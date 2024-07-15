console.log(`product V running`)


//////////////////////
// Render error handler errors
const urlParams = new URLSearchParams(window.location.search)
const errorMessage = urlParams.get("error")
console.log(`error message --${errorMessage}`)
if (errorMessage) {
  document.getElementById("errorMessage").innerHTML = decodeURIComponent(errorMessage)
}

////////////////////

let errorList = []

function validateName() {
  var name = document.getElementById("name").value.trim()
  var nameInput = document.getElementById("name")
  var nameError = document.getElementById("nameError")
  nameError.innerHTML = ""
  const errors = []

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters")
  }
  if (name!=document.getElementById("name").value) {
    errors.push("Name Cant be start with a space")
  }
  if (name.length > 100) {
    errors.push("Name must be less than 100 characters")
  }
  if (/[0-9]/.test(name)) errors.push("Name must not contain numbers")

  if (errors.length > 0) {
    nameInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      nameError.appendChild(errorSpan)
      nameError.appendChild(document.createElement("br")) // Add line break between errors
    })
    nameError.style.color = "red"
    return false
  } else {
    nameInput.style.border = "2px solid #39ff14"
    return true
  }
}

function validateAuthor() {
  var author = document.getElementById("author").value.trim()
  var authorInput = document.getElementById("author")
  var authorError = document.getElementById("authorError")
  authorError.innerHTML = ""
  const errors = []

  if (author.length < 3) {
    errors.push("Author name must be at least 3 characters")
  }
  if (author!=document.getElementById("author").value) {
    errors.push("Name Cant be start with a space")
  }
  if (author.length > 50) {
    errors.push("Name must be less than 50 characters")
  }
  if (/[0-9]/.test(author)) errors.push("Name must not contain numbers")

  if (errors.length > 0) {
    authorInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      authorError.appendChild(errorSpan)
      authorError.appendChild(document.createElement("br")) // Add line break between errors
    })
    authorError.style.color = "red"
    return false
  } else {
    authorInput.style.border = "2px solid #39ff14"
    return true
  }
}
function validateDescription() {
  var description = document.getElementById("description").value.trim()
  var descriptionInput = document.getElementById("description")
  var descriptionError = document.getElementById("descriptionError")
  descriptionError.innerHTML = ""
  const errors = []

  if (description.length < 10) {
    errors.push("Description must be at least 10 characters")
  }
  if (description.length > 5000) {
    errors.push("Description must be less than 5000 characters")
  }

  if (errors.length > 0) {
    descriptionInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      descriptionError.appendChild(errorSpan)
      descriptionError.appendChild(document.createElement("br")) // Add line break between errors
    })
    descriptionError.style.color = "red"
    return false
  } else {
    descriptionInput.style.border = "2px solid #39ff14"
    return true
  }
}

function validateCategory() {
  var category = document.getElementById("catSelect").value.trim()
  var categoryInput = document.getElementById("catSelect")
  var categoryError = document.getElementById("categoryError")
  categoryError.innerHTML = ""
  const errors = []

  if (category=="") {
    errors.push("select a category")
  }
  if (errors.length > 0) {
    categoryInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      categoryError.appendChild(errorSpan)
      categoryError.appendChild(document.createElement("br")) // Add line break between errors
    })
    categoryError.style.color = "red"
    return false
  } else {
    categoryInput.style.border = "2px solid #39ff14"
    return true
  }
}
function validateSubCategory() {
  var subCategory = document.getElementById("category").value.trim()
  var subCategoryInput = document.getElementById("category")
  var subCategoryError = document.getElementById("subCategoryError")
  subCategoryError.innerHTML = ""
  const errors = []

  if (subCategory=="") {
    errors.push("select a category")
  }
  if (errors.length > 0) {
    subCategoryInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      subCategoryError.appendChild(errorSpan)
      subCategoryError.appendChild(document.createElement("br")) // Add line break between errors
    })
    subCategoryError.style.color = "red"
    return false
  } else {
    subCategoryInput.style.border = "2px solid #39ff14"
    return true
  }
}
function validatePrice() {
  var price = document.getElementById("price").value.trim()
  price =Number(price)
console.log(`price is${isNaN( price)}`)
  var priceInput = document.getElementById("price")
  var priceError = document.getElementById("priceError")
  priceError.innerHTML = ""
  const errors = []

  if (isNaN(price) || parseFloat(price) <= 0) {
    errors.push("Price is required")
  }

  if (errors.length > 0) {
    priceInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      priceError.appendChild(errorSpan)
      priceError.appendChild(document.createElement("br")) // Add line break between errors
    })
    priceError.style.color = "red"
    return false
  } else {
    priceInput.style.border = "2px solid #39ff14"
    return true
  }
}

function validateStockCount() {
  var stockCount = document.getElementById("stockCount").value
  stockCount=Number(stockCount)
  var stockCountInput = document.getElementById("stockCount")
  var stockCountError = document.getElementById("stockCountError")
  stockCountError.innerHTML = ""
 console.log(`stock count is${stockCount} type is ${typeof stockCount}`) 
  const errors = []

  if (stockCount=="") {
    errors.push("This field cant be empty")
  }
  if (isNaN(stockCount) || stockCount< 0) {
    errors.push("Valid quantity is required")
  }
  if (typeof(stockCount)=='String') {
 console.log(`stock count is${stockCount} type is ${typeof stockCount}`) 
    errors.push("value must be a Number")
  }

  if (errors.length > 0) {
    stockCountInput.style.border = "2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      stockCountError.appendChild(errorSpan)
      stockCountError.appendChild(document.createElement("br")) // Add line break between errors
    })
    stockCountError.style.color = "red"
    return false
  } else {
    stockCountInput.style.border = "2px solid #39ff14"
    return true
  }
}

function validateImage() {
  const fileInput = document.getElementById("file-input")
  const imageError = document.getElementById("imageError")
  const files = fileInput.files
  imageError.innerHTML = ""
  const errors = []

  if (files.length === 0) {
    errors.push("At least one image is required")
  } else {
    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        errors.push("Only image files are allowed")
        break
      }
    }
  }

  if (errors.length > 0) {
    document.getElementById('imgC').style.border="2px solid red"
    errors.forEach((error) => {
      const errorSpan = document.createElement("span")
      errorSpan.innerText = error
      imageError.appendChild(errorSpan)
      imageError.appendChild(document.createElement("br")) // Add line break between errors
    })
    imageError.style.color = "red"
    return false
  } else {
    document.getElementById('imgC').style.border="2px solid #39ff14"
    return true
  }
}

document.getElementById("save-product").addEventListener("click", (event) => {
  event.preventDefault()

  const isNameValid = validateName()
  const isAuthorValid = validateAuthor()
  const isDescriptionValid = validateDescription()
  const isPriceValid = validatePrice()
  const isStockCountValid = validateStockCount()
  const isImageValid = validateImage()
  const isCategoryValid = validateCategory()
  const isSubCategoryValid = validateSubCategory()
  if (isNameValid && isAuthorValid  &&  isCategoryValid && isSubCategoryValid &&  isDescriptionValid && isPriceValid && isStockCountValid && isImageValid) {
sendRequest ()
  } else {
    window.toast.errorMessage("Please fill all the required fields correctly")
  }
})
document.getElementById("mainContent").addEventListener("change", () => {
   validateName();
   validateAuthor();
   validateDescription();
   validatePrice();
   validateStockCount();
   validateImage();
   validateCategory();
   validateSubCategory();
});


  function getSubcategoryValues() {
    const subcatSelects = document.querySelectorAll('.subcatSelect');
    const subcategoryValues = [];

    subcatSelects.forEach(select => {
      subcategoryValues.push(select.value);
    });

    return subcategoryValues;
  }

  // Example usage
  document.getElementById('save-product').addEventListener('click', (event) => {
    event.preventDefault();

    const subcategoryValues = getSubcategoryValues();
    console.log('Selected subcategory values:', subcategoryValues);

    // Perform further actions, such as validation or form submission
    // ...
  });

