async function getSearchProducts(searchValue) {
  const response = await fetch(`/admin/products/search?search=${searchValue}`)
  const responseData = await response.json()
  let products = responseData.products
  let user = responseData.user
  const tableBody = document.getElementById("contentTbody")
  tableBody.innerHTML = "" // Clear previous cards

  products.forEach((product) => {
    const tr = document.createElement("tr")
    tr.id = "contentTbodyTr"

    // Add product name
    const nameTd = document.createElement("td")
    nameTd.textContent = product.name
    tr.appendChild(nameTd)

    // Add product price
    const priceTd = document.createElement("td")
    priceTd.textContent = product.price
    tr.appendChild(priceTd)

    // Add product stock count
    const stockTd = document.createElement("td")
    stockTd.textContent = product.stockCount
    tr.appendChild(stockTd)

    // Add product image
    const imgTd = document.createElement("td")
    const img = document.createElement("img")
    img.src = product.image && product.image[0]
    img.alt = "Product image"
    img.className = "img-thumbnail"
    img.width = "70"
    imgTd.appendChild(img)
    tr.appendChild(imgTd)

    // Add product status
    const statusTd = document.createElement("td")
    statusTd.id = "status"
    statusTd.className = "status"
    statusTd.textContent = product.status ? "Active" : "Unlisted"
    tr.appendChild(statusTd)

    // Add checkbox for product status
    const checkboxTd = document.createElement("td")
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.dataset.status = product.status
    checkbox.dataset.id = product._id
    checkboxTd.appendChild(checkbox)
    tr.appendChild(checkboxTd)

    // Add Edit and Delete buttons
    const actionsTd = document.createElement("td")
    const editLink = document.createElement("a")
    editLink.href = `/admin/products/${product._id}/edit`
    editLink.className = "btn btn-sm text-warning"
    editLink.textContent = "Edit"

    const deleteLink = document.createElement("a")
    deleteLink.id = "deleteButton"
    deleteLink.className = "btn btn-sm text-danger"
    deleteLink.dataset.id = product._id
    deleteLink.onclick = "removeProduct()"
    deleteLink.textContent = "Delete"

    const hiddenInput = document.createElement("input")
    hiddenInput.id = "productId"
    hiddenInput.type = "hidden"
    hiddenInput.value = product._id

    actionsTd.appendChild(editLink)
    actionsTd.appendChild(document.createTextNode(" "))
    actionsTd.appendChild(deleteLink)
    actionsTd.appendChild(hiddenInput)

    tr.appendChild(actionsTd)

    // Append the row to the table body
    tableBody.appendChild(tr)
  })
}

async function getSearchUsers(searchValue) {
  const response = await fetch(`/admin/users/search?search=${searchValue}`)
  const responseData = await response.json()
  users = responseData.users
  const tableBody = document.getElementById("contentTbody")
  tableBody.innerHTML = "" // Clear previous cards

  users.forEach((user) => {
    const tr = document.createElement("tr")
    tr.id = "contentTbodyTr"

    // Add user name
    const nameTd = document.createElement("td")
    nameTd.textContent = user.name
    tr.appendChild(nameTd)

    // Add user email
    const emailTd = document.createElement("td")
    emailTd.textContent = user.email
    tr.appendChild(emailTd)

    // Add user role
    const roleTd = document.createElement("td")
    roleTd.textContent = user.role
    tr.appendChild(roleTd)

    // Add user status
    const statusTd = document.createElement("td")
    statusTd.id = "status"
    statusTd.className = "status"
    statusTd.dataset.status = user.status
    statusTd.textContent = user.status ? "Active" : "Blocked"
    tr.appendChild(statusTd)

    // Add checkbox for user status
    const checkboxTd = document.createElement("td")
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.dataset.user = user.id
    checkbox.dataset.status = user.status
    checkbox.checked = user.status
    checkbox.addEventListener("change", function () {
      updateUserStatus(user.id, !user.status)
    })
    checkboxTd.appendChild(checkbox)
    tr.appendChild(checkboxTd)

    // Add hidden input fields for user ID and status
    const userIdInput = document.createElement("input")
    userIdInput.id = "userId"
    userIdInput.type = "hidden"
    userIdInput.value = user.id

    const userStatusInput = document.createElement("input")
    userStatusInput.id = "userStatus"
    userStatusInput.type = "hidden"
    userStatusInput.value = user.status

    tr.appendChild(userIdInput)
    tr.appendChild(userStatusInput)

    // Append the row to the table body
    tableBody.appendChild(tr)
  })
}

async function getSearchCategory(searchValue) {
  const response = await fetch(`/admin/category/search?search=${searchValue}`)
  const responseData = await response.json()
  category = responseData.category
  const tableBody = document.getElementById("contentTbody")
  tableBody.innerHTML = "" // Clear previous cards

 category.forEach((category) => {
    const tr = document.createElement("tr")
    tr.id = "contentTbodyTr"

    // Add category name
    const nameTd = document.createElement("td")
    nameTd.textContent = category.name
    tr.appendChild(nameTd)

    const imageTd = document.createElement("td")
    const img = document.createElement("img")
    img.src = category.image
    img.alt = "category image"
    img.className = "img-thumbnail"
    img.width = "70"
    imageTd.appendChild(img)
    tr.appendChild(imageTd)

    // Add category status
    const statusTd = document.createElement("td")
    statusTd.id = "status"
    statusTd.className = "status"
    statusTd.dataset.status = category.status
    statusTd.textContent = category.status ? "Active" : "Blocked"
    tr.appendChild(statusTd)

    // Add checkbox for category status
    const checkboxTd = document.createElement("td")
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.dataset.category = category.id
    checkbox.dataset.status = category.status
    checkbox.checked = category.status
    checkbox.addEventListener("change", function () {
      updateUserStatus(category.id, !category.status)
    })
    checkboxTd.appendChild(checkbox)
    tr.appendChild(checkboxTd)

    // Add hidden input fields for category ID and status
    const categoryIdInput = document.createElement("input")
    categoryIdInput.id = "categoryId"
    categoryIdInput.type = "hidden"
    categoryIdInput.value = category.id

    const categoryStatusInput = document.createElement("input")
    categoryStatusInput.id = "categoryStatus"
    categoryStatusInput.type = "hidden"
    categoryStatusInput.value = category.status

    tr.appendChild(categoryIdInput)
    tr.appendChild(categoryStatusInput)

   
    const actionsTd = document.createElement("td")
    const editLink = document.createElement("a")
    editLink.href=`/admin/categories/${category._id}/edit`
    editLink.style.with="5 rem"
    editLink.className = "btn btn-sm text-warning"
    editLink.textContent = "Edit"

    // const deleteButton = document.createElement('a');
    // deleteButton.className = 'btn btn-sm text-danger';
    // deleteButton.style.width = '5rem';
    // deleteButton.textContent = 'Delete';
    // deleteButton.setAttribute('data-id', category.id); // Assuming category is defined in your scope
    // deleteButton.setAttribute('onclick', 'removeCategory()');

    // Create the hidden input
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'productId';
    hiddenInput.value = `${category._id}`;

    actionsTd.appendChild(editLink)
    // actionsTd.appendChild(deleteButton)
    actionsTd.appendChild(hiddenInput)
    tr.appendChild(actionsTd)
    // Append the row to the table body
    tableBody.appendChild(tr)
  })
}
