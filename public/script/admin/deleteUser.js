function dUser(userId) {
  if (window.confirm("Are you sure about deleting this user?")) {
    fetch(`/admin/users/${userId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // You may need to include additional headers like authorization if required
      },
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., redirect or update UI
          console.log("User deleted successfully")
        } else {
          // Handle errors
          console.error("Error deleting user")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }
}



function disableAdminRow() {
  const rows = document.querySelectorAll('#contentTbody tr');
  
  rows.forEach(row => {
    const isCurrentAdmin = row.getAttribute('data-is-current-admin') === 'true';
    const checkbox = row.querySelector('.checkbox');
    const statusCell = row.querySelector('.status');

    if (isCurrentAdmin) {
      // Disable the checkbox
      if (checkbox) {
        checkbox.disabled = true;
        checkbox.style.pointerEvents = 'none';
      }

      // Add a visual indicator that the row is disabled
      row.style.opacity = '0.6';
      row.style.backgroundColor = '#f8f9fa';

      // Add a tooltip to explain why the row is disabled
      row.title = 'You cannot modify your own account';

      // Optionally, you can also disable all links in this row
      const links = row.querySelectorAll('a');
      links.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.color = '#6c757d';
      });

      // Update the status cell
      if (statusCell) {
        statusCell.style.color = '#6c757d';
      }
    }
  });
}

// Call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', disableAdminRow);


// Existing script content
const navSearchInput = document.getElementById("adminSearch");
navSearchInput.addEventListener("input", function() {
  let searchValue = navSearchInput.value;
  getSearchUsers(searchValue);
});

const switchInputs = document.querySelectorAll('.checkbox');
const statuses = document.querySelectorAll('.status');

switchInputs.forEach((switchInput, index) => {
  const status = statuses[index].textContent.trim();
  statuses[index].style.color = status === 'Blocked' ? "#912727" : "green";
  switchInput.checked = status !== 'Active';
});

async function changeStatus(userId, newStatus) {
  console.log(`Changing status for user ${userId} to ${newStatus}`);
  
  const checkbox = document.getElementById(`checkbox-${userId}`);
  const statusCell = document.getElementById(`status-${userId}`);
  const row = checkbox.closest('tr');
  
  // Check if this is the current admin's row
  if (row.getAttribute('data-is-current-admin') === 'true') {
    console.log('Cannot change status of current admin');
    checkbox.checked = !newStatus;
    return;
  }
  
  row.style.opacity = '0.5';
  
  try {
    const response = await axios.put(`users/${userId}/edit?status=${newStatus}`);

    console.log('Response data:', response.data);
    
    statusCell.textContent = !newStatus ? 'Active' : 'Blocked';
    statusCell.style.color = !newStatus ? 'green' : '#912727';
    console.log(`${newStatus}`);
    checkbox.checked = newStatus;
    
    row.style.transition = 'background-color 1s';
    row.style.backgroundColor = '#d4edda';
    setTimeout(() => {
      row.style.backgroundColor = '';
    }, 1000);
  } catch (error) {
    console.error('Error changing status:', error);
    checkbox.checked = !newStatus;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'Failed to update status. Please try again.';
    errorMessage.style.color = 'red';
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 3000);
  } finally {
    row.style.opacity = '1';
  }
}

// Event delegation for checkbox changes
document.getElementById('contentTbody').addEventListener('change', function(event) {
  if (event.target.classList.contains('checkbox')) {
    const userId = event.target.dataset.userId;
    const newStatus = event.target.checked;
    changeStatus(userId, newStatus);
  }
});

// Call disableAdminRow when the DOM is loaded
document.addEventListener('DOMContentLoaded', disableAdminRow);
