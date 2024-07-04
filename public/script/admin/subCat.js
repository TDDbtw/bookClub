// Get the input field for the category name
console.log(`Sub is running`)

async function removeSubcategory(subCatId) {

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
    const response = await fetch(
      `/admin/categories/delete?subCatId=${subCatId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subCatId: subCatId }),
      }
    )

    const data = await response.json()
    console.log(data)
    if (data.success) {
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      console.log("Successfully deleted")
      window.location.reload(true)
    }
  } catch (error) {
    console.log("Error:", error)
    // Handle errors as needed
  }}
}

async function addSubcategory() {
  const name = document.getElementById("subCategoryName").value
  const category = document.getElementById("catId").value
  //- console.log(name)
  try {
    const response = await fetch(`/admin/categories/${category}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, category: category }),
    })

    const data = await response.json()
    console.log(data)
    if (data.success == true) {
      console.log(data)
    }
  } catch (error) {
    console.log("Error:", error)
    // Handle errors as needed
  }
}



async function getSearchSubCategory(searchValue) {
  const response = await fetch(`/admin/category/:id/edit/search?search=${searchValue}`)
  const responseData = await response.json()
  let subCategory = responseData.subcategory
 console.log(`${subCategory}`) 
}
