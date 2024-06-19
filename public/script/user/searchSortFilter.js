document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sortBy').addEventListener('change', getSortedProducts);

  async function getSortedProducts() {
    const sortBy = document.getElementById('sortBy').value;
    const url = new URL('/api/products', window.location.origin);
    const searchParams = new URLSearchParams();
    
    if (sortBy) {
      searchParams.append('sortBy', sortBy);
    }

    // Add other search/filter parameters if needed
    const search = document.getElementById('search').value;
    if (search) {
      searchParams.append('search', search);
    }

    const subcategory = document.querySelector('.list-unstyled li.selected')?.dataset.subCat;
    if (subcategory) {
      searchParams.append('subcategory', subcategory);
    }

    url.search = searchParams.toString();

    try {
      const response = await fetch(url);
      const data = await response.json();
      displayProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async function getFilteredProducts(subCat) {
    const url = new URL('/api/products', window.location.origin);
    const searchParams = new URLSearchParams();

    searchParams.append('subcategory', subCat);

    // Add other search/sort parameters if needed
    const sortBy = document.getElementById('sortBy').value;
    if (sortBy) {
      searchParams.append('sortBy', sortBy);
    }

    const search = document.getElementById('search').value;
    if (search) {
      searchParams.append('search', search);
    }

    url.search = searchParams.toString();

    try {
      const response = await fetch(url);
      const data = await response.json();
      displayProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function displayProducts(products) {
    const productList = document.getElementById('cardSection');
    productList.innerHTML = '';

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.className = 'col';
      productItem.innerHTML = `
        <div class="card">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Price: $${product.price}</p>
            <p class="card-text">Ratings: ${product.ratings}</p>
            <p class="card-text">Subcategories: ${product.subcategories.join(', ')}</p>
          </div>
        </div>
      `;
      productList.appendChild(productItem);
    });
  }
});
