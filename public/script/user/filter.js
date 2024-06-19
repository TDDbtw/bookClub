async function getFilteredProducts(subId) {
  const response = await fetch(`/products/filter?subcategory=${subId}`)
  const responseData = await response.json()
  products = responseData.products
  user = responseData.user
  const cardSection = document.getElementById("cardSection")
  const noProduct = document.createElement("div")
  cardSection.innerHTML = "" // Clear previous cards
  if (products.length == 0) {
    noProduct.style = "margin-left:2%; margin-top:5%;"
    noProduct.className = "text-warning text-center "
    noProduct.innerHTML = "No products available in this category"
    cardSection.appendChild(noProduct)
  } else {
    noProduct.style = "display:none;"
    products.forEach((product) => {
      // Assuming you have a container element with id 'productContainer'
      const container = document.getElementById("cardSection")

      // Create elements
      const cardCol = document.createElement("div")
      cardCol.className = "cardCol col-md-4 col-sm-12 mb-5"

      const productCard = document.createElement("div")
      productCard.id = "productCard"
      productCard.className = "card text-white"
      productCard.setAttribute("onclick", "PDP()")

      const productLink = document.createElement("a")
      productLink.href = `/products/${product._id}`

      const heartIcon = document.createElement("div")
      heartIcon.className = "heart-icon"
      heartIcon.style =
        "text-align: right; margin-top:26.67px;margin-right:25.3px;"
      heartIcon.setAttribute("href", `/products/${product._id}`)

      const svgHeartIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )
      svgHeartIcon.setAttribute("width", "34")
      svgHeartIcon.setAttribute("height", "34")
      svgHeartIcon.setAttribute("viewBox", "0 0 34 34")
      svgHeartIcon.setAttribute("fill", "none")

      const clipPath = document.createElement("defs")
      const clipRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath"
      )
      const clipRectElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      )
      clipRectElement.setAttribute("width", "33.3333")
      clipRectElement.setAttribute("height", "33.3333")
      clipRectElement.setAttribute("fill", "white")
      clipRectElement.setAttribute("transform", "translate(0.332031)")
      clipRect.appendChild(clipRectElement)
      clipPath.appendChild(clipRect)

      const heartPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      heartPath.setAttribute(
        "d",
        "M27.4152 17.4609L16.9985 27.7776L6.58185 17.4609C5.89478 16.7924 5.35358 15.9887 4.99234 15.1007C4.63109 14.2127 4.45763 13.2595 4.48288 12.3011C4.50812 11.3428 4.73152 10.4 5.13902 9.53225C5.54651 8.66447 6.12926 7.89047 6.85058 7.25898C7.5719 6.62748 8.41617 6.15218 9.3302 5.86301C10.2442 5.57383 11.2082 5.47704 12.1615 5.57873C13.1148 5.68042 14.0367 5.97839 14.8692 6.45388C15.7016 6.92936 16.4266 7.57206 16.9985 8.3415C17.5729 7.57765 18.2987 6.94056 19.1306 6.47012C19.9625 5.99968 20.8825 5.70602 21.8331 5.60751C22.7838 5.50899 23.7445 5.60775 24.6551 5.89761C25.5658 6.18746 26.4069 6.66216 27.1257 7.29201C27.8445 7.92186 28.4255 8.69329 28.8324 9.55802C29.2394 10.4228 29.4634 11.3622 29.4906 12.3175C29.5178 13.2728 29.3475 14.2234 28.9904 15.1099C28.6333 15.9964 28.097 16.7996 27.4152 17.4693"
      )
      heartPath.setAttribute("stroke", "white")
      heartPath.setAttribute("stroke-opacity", "0.75")
      heartPath.setAttribute("stroke-width", "2.08333")
      heartPath.setAttribute("stroke-linecap", "round")
      heartPath.setAttribute("stroke-linejoin", "round")

      svgHeartIcon.appendChild(clipPath)
      svgHeartIcon.appendChild(heartPath)

      heartIcon.appendChild(svgHeartIcon)
      productLink.appendChild(heartIcon)

      const productImage = document.createElement("img")
      productImage.className = "card-image"
      productImage.src = product.image[0] || "default-image.jpg"
      productImage.alt = "Product Image"
      productImage.style =
        "width: 333.125px; height: 272.906px; margin-top: 84.56px; margin-left: auto; margin-right: auto; display: block; cursor: pointer"
      productImage.onclick = () => {
        window.location.href = "/products/" + product._id
      }

      const productName = document.createElement("h5")
      productName.className = "mx-5 mt-3"
      productName.textContent = product.name

      const productId = document.createElement("p")
      productId.id = "productId"
      productId.setAttribute("type", "hidden")
      productId.setAttribute("value", product.id)

      const productPrice = document.createElement("p")
      productPrice.className = "card-price mx-5"
      productPrice.textContent = product.price

      const specificationsList = document.createElement("ul")
      product.specifications.forEach((spec) => {
        const specItem = document.createElement("li")
        specItem.className = "mx-4"
        specItem.textContent = `${spec.name}: ${spec.value}`
        specificationsList.appendChild(specItem)
      })

      const addToCartForm = document.createElement("form")
      addToCartForm.action = "/cart/add"
      addToCartForm.method = "POST"

      const hiddenInputs = [
        "productId",
        "image",
        "name",
        "productPrice",
        "specifications",
        "description",
        "category",
      ]
      hiddenInputs.forEach((inputName) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = inputName
        input.value = product[inputName]
        addToCartForm.appendChild(input)
      })

      const quantityInput = document.createElement("input")
      quantityInput.type = "hidden"
      quantityInput.name = "quantity"
      quantityInput.value = 1
      addToCartForm.appendChild(quantityInput)

      const userInput = document.createElement("input")
      userInput.type = "hidden"
      userInput.name = "user"
      userInput.value = `${user.id}`
      addToCartForm.appendChild(userInput)

      const addToCartButton = document.createElement("button")
      addToCartButton.className = "card-button ms-3"
      addToCartButton.type = "submit"
      addToCartButton.textContent = "Add to Cart"

      const arrowIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )
      arrowIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      arrowIcon.setAttribute("width", "20")
      arrowIcon.setAttribute("height", "20")
      arrowIcon.setAttribute("viewBox", "0 0 24 24")
      arrowIcon.setAttribute("stroke-width", "1")
      arrowIcon.setAttribute("stroke", "#010a07")
      arrowIcon.setAttribute("fill", "none")
      arrowIcon.setAttribute("stroke-linecap", "round")
      arrowIcon.setAttribute("stroke-linejoin", "round")

      const arrowPath1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      arrowPath1.setAttribute("stroke", "none")
      arrowPath1.setAttribute("d", "M0 0h24v24H0z")
      arrowIcon.appendChild(arrowPath1)

      const arrowPath2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      arrowPath2.setAttribute("d", "M5 12l14 0")
      arrowIcon.appendChild(arrowPath2)

      const arrowPath3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      arrowPath3.setAttribute("d", "M15 16l4 -4")
      arrowIcon.appendChild(arrowPath3)

      const arrowPath4 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      arrowPath4.setAttribute("d", "M15 8l4 4")
      arrowIcon.appendChild(arrowPath4)

      addToCartButton.appendChild(arrowIcon)
      addToCartForm.appendChild(addToCartButton)

      // Append elements to the container
      productCard.appendChild(productLink)
      productCard.appendChild(productImage)
      productCard.appendChild(productName)
      productCard.appendChild(productId)
      productCard.appendChild(productPrice)
      productCard.appendChild(specificationsList)
      productCard.appendChild(addToCartForm)

      cardCol.appendChild(productCard)
      container.appendChild(cardCol)
    })
  }
}
