const urlParams = new URLSearchParams(window.location.search);
console.log(`url params are${urlParams}`)
let currentPage = 1; // Current page (start on page 1)
let totalPages = 1; // Will be updated from the backend response
const user =document.getElementById('userDetails').value
const noProduct = document.createElement("div")
if (user!=undefined){
  // user=JSON.stringify(user)
  console.log(`user id is ${user}`)
}
let subCat="All"
let searchValue = urlParams.get('search') 
let sortValue = urlParams.get('sort')  // Default value can be adjusted
let filterValue = urlParams.get('filter') 
console.log(`search-- ${searchValue}  sort--${sortValue} filter--- ${filterValue} `)

if(searchValue==null&&sortValue==null&&filterValue==null){
  console.log(`is null`)

  document.getElementById('clearBtn').style.display='none'
  axios.get('/products/list')
    .then(response => {

      const products = response.data.products;
      const total = response.data.total;
      console.log(`total is ${total}`) 

      const limit = response.data.limit;
      console.log(`limit is ${limit}`)
      const page = response.data.page;
      currentPage =response.data.page ;  // Current page (start on page 1)
      totalPages = Math.ceil(total/limit) // Will be updated from the backend response
      console.log(`total pages are  ${totalPages}`) 
      renderPagination()
      const item = response.data.products;
      renderCards(item)
    })
    .catch(error => {
      console.error('There was an error fetching the products!', error);
    });
}





const items = document.querySelectorAll('input[data-sub-cat]');



items.forEach(item => {
  item.addEventListener('input', (e) => {
    e.stopPropagation();
    console.log(e.target.dataset.subCat);
   console.log(`filter value is${filterValue}`) 
    // removeProduct(e.target.dataset.id);
    subCat=e.target.dataset.subCat
    searchSortFilter()

  });
});

document.getElementById('sortBy').addEventListener('change', searchSortFilter);
document.getElementById('navSearch').addEventListener('input', searchSortFilter);

function searchSortFilter() {

  document.getElementById('clearBtn').style.display='block'

  event.preventDefault()
  console.log(`${document.getElementById('navSearch').value}`) 
  document.getElementById("cardSection").innerHTML=""
  let url = new URL(window.location.href);
  const page =  currentPage// example page number
  const limit = 3; // example limit
  const search =document.getElementById('navSearch').value; // example search term
  const sort =  document.getElementById('sortBy').value// example sort order

  axios.get('/products/list', {
    params: {
      page,
      limit,
      search,
      sort,
      subCat
    }
  })
    .then(response => {
      const products = response.data.products;
      const total = response.data.total;
      const limit = response.data.limit;
      const page = response.data.page;
      currentPage =response.data.page ;  // Current page (start on page 1)
      totalPages = Math.ceil(total/limit) // Will be updated from the backend response
      renderPagination()
      renderCards(products)
    })
    .catch(error => {
      console.error('There was an error fetching the products!', error);
    });
}
function clearQueryParam(param) {
  console.log('heloq')
        }


document.getElementById('clearBtn').addEventListener('click', clear);
document.getElementById('clearSearch').addEventListener('click',clearQueryParam('sort') );
document.getElementById('clearSort').addEventListener('click', clearQueryParam('sort') );
document.getElementById('clearFilter').addEventListener('click', clearQueryParam('sort'));


function clear() {
  console.log(`clicked`) 
  window.location.href = `/products`;
}

function renderCards(products){    
  if(products.length==0){
    noProduct.style = "margin-left:2%; margin-top:5%; color:gold;"
    noProduct.className = "text-warning text-center "
    noProduct.innerHTML = "No products available in this category"
    cardSection.appendChild(noProduct)

  }else{
  products.forEach((product) => {
    console.log(`product id is${product._id}`)
    // Assuming you have a container element with id 'productContainer'
    const container = document.getElementById("cardSection")

    // Create elements
    const cardCol = document.createElement("div")
    cardCol.className = "cardCol col-md-4 col-sm-12 mb-5"

    const productCard = document.createElement("div")
    productCard.id = "productCard"
    productCard.className = "card text-white productCard"
    productCard.setAttribute('data-product-id', product._id)
    const productLink = document.createElement("div")


    const heartIcon = document.createElement("div")
    heartIcon.className = "heart-icon"
    heartIcon.style =
      "text-align: right; margin-top:26.67px;margin-right:25.3px;"
    heartIcon.className = 'add-to-wishlist-btn';
    heartIcon.setAttribute('data-product-id', product._id);
    heartIcon.setAttribute('data-user-id', user);
    heartIcon.style.cursor = 'pointer';
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
      "width:177.734px ; height: 272.906px; margin-top: 84.56px; margin-left: auto; margin-right: auto; display: block; cursor: pointer"
    productImage.onclick = () => {
      window.location.href = "/products/" + product._id
    }

    const productName = document.createElement("h5")
    productName.className = "mx-5 mt-3"
    productName.style.color = "lightblue";
    productName.textContent = product.name

    const productId = document.createElement("p")
    productId.id = "productId"
    productId.setAttribute("type", "hidden")
    productId.setAttribute("value", product._id)


    const productAuthor = document.createElement("p")
    productAuthor.className = "author mx-5"
    productAuthor.textContent = `${product.author}`


    const productPrice = document.createElement("p")
    productPrice.className = "card-price mx-5"

    productPrice.style.color='gold' /* Gold text color */
      productPrice.style.fontSize='18px' /* Adjust font size as needed */
      productPrice.style.fontWeight='bold' /* Make the text bold for emphasis */
      productPrice.textContent = `$${product.price}`


    const addToCartForm = document.createElement("form")
    addToCartForm.action = "/cart/add"
    addToCartForm.method = "POST"


    const hiddenInputs = [
      { name: "productId", value: product._id },
      { name: "author", value: product.author },
      { name: "image", value: product.image[0] },
      { name: "name", value: product.name },
      { name: "productPrice", value: product.price },
      { name: "description", value: product.description },
      { name: "category", value: product.category },
      { name: "user", value: user }
    ];

    hiddenInputs.forEach(({ name, value }) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      input.user = user;
      addToCartForm.appendChild(input);
    });


    const quantityInput = document.createElement("input")
    quantityInput.type = "hidden"
    quantityInput.name = "quantity"
    quantityInput.value = 1
    addToCartForm.appendChild(quantityInput)


    if (user) {
      const userInput = document.createElement("input");
      userInput.type = "hidden";
      userInput.name = "user";
      userInput.value = user;
      addToCartForm.appendChild(userInput);
    }

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
    productCard.appendChild(productAuthor)
    productCard.appendChild(productPrice)
    productCard.appendChild(addToCartForm)

    cardCol.appendChild(productCard)
    container.appendChild(cardCol)

  function PDP() {
  window.location.href = `/products/${product._id}`;
  }


  });
}} 


function renderPagination() {
  const paginationContainer = document.getElementById('pagination'); // Create a <div id="pagination"> in your Pug template
  paginationContainer.innerHTML = ''; // Clear previous links
  console.log('running pagi'+ totalPages)

  if (totalPages > 1) {
    // Add "Previous" button
    if (currentPage > 1) {
      const prevLink = document.createElement('a'); 
      prevLink.href = '#';
      prevLink.textContent = 'Previous';
      prevLink.addEventListener('click', () => {
        currentPage--;
        searchSortFilter()
      });
      paginationContainer.appendChild(prevLink);
    }

    // Add page number links
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i; 
      pageLink.classList.toggle('active', i === currentPage); // Add "active" class to the current page link
      pageLink.addEventListener('click', () => {
        currentPage = i;
        searchSortFilter()
      });
      paginationContainer.appendChild(pageLink);
    }
    console.log('running ')
    // Add "Next" button
    if (currentPage < totalPages) {
      const nextLink = document.createElement('a');
      nextLink.href = '#';
      nextLink.textContent = 'Next';
      nextLink.addEventListener('click', () => {
        currentPage++;
        searchSortFilter()

      });
      paginationContainer.appendChild(nextLink); 
    }
  }
}

     document.addEventListener('DOMContentLoaded', () => {
     const categoryItems = document.querySelectorAll('#categoryList > li');

      categoryItems.forEach(item => {
      const checkboxes = item.querySelectorAll('.subcatCheckbox');
      
      // Toggle open class when clicking on category name
        item.querySelector('.catName').addEventListener('click', () => {
        item.classList.toggle('open');
      });

      // Handle checkbox changes
        checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          updateCategoryOpenState(item);
          });
        });
      });

      function updateCategoryOpenState(categoryItem) {
      const checkboxes = categoryItem.querySelectorAll('.subcatCheckbox');
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    
       if (anyChecked) {
      categoryItem.classList.add('open');
      } else {
      categoryItem.classList.remove('open');
      }
      } 
      });
