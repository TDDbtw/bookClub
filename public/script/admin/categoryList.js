console.log(`running list`)
       var navSearchInput = document.getElementById("adminSearch");
    // Add an event listener to the input element for the input event
    navSearchInput.addEventListener("input", function() {
      // Log the value of the input to the console
      let searchValue=navSearchInput.value;
      //- console.log("Input value:", searchValue);
      getSearchProducts(searchValue)
    });
    
    const buttons = document.querySelectorAll('a[data-id]');
    
     buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        console.log(e.target.dataset.id);
        removeCategory(e.target.dataset.id)
      });
    });
async function removeCategory(categoryId) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`/admin/categories/${categoryId}/delete`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { categoryId: categoryId }
      });

      const data = response.data;

      if (data.success) {
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );

        window.location.href = '/admin/category';
      } else {
        Swal.fire(
          'Error!',
          'There was a problem deleting your category.',
          'error'
        );
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        'There was a problem deleting your category.',
        'error'
      );
    }
  }
}
