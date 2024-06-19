// Get the input field for the category name
console.log(`Sub is running`)

const buttons = document.querySelectorAll("a[data-id]")

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    console.log(e.target.dataset.id)

    removeSubcategory(e.target.dataset.id)
  })
})

async function removeSubcategory(subCatId) {
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
      console.log("Successfully deleted")
      window.location.reload(true)
    }
  } catch (error) {
    console.log("Error:", error)
    // Handle errors as needed
  }
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
