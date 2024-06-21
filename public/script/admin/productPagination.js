function renderPagination() {
  const paginationContainer = document.getElementById('pagination'); // Create a <div id="pagination"> in your Pug template
  paginationContainer.innerHTML = ''; // Clear previous links

  if (totalPages > 1) {
    // Add "Previous" button
    if (currentPage > 1) {
      const prevLink = document.createElement('a'); 
      prevLink.href = '#';
      prevLink.textContent = 'Previous';
      prevLink.addEventListener('click', () => {
        currentPage--;
        fetchAndDisplayProducts(); 
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
        fetchAndDisplayProducts(); 
      });
      paginationContainer.appendChild(pageLink);
    }

    // Add "Next" button
    if (currentPage < totalPages) {
      const nextLink = document.createElement('a');
      nextLink.href = '#';
      nextLink.textContent = 'Next';
      nextLink.addEventListener('click', () => {
        currentPage++;
        fetchAndDisplayProducts(); 
      });
      paginationContainer.appendChild(nextLink); 
    }
  }
}
