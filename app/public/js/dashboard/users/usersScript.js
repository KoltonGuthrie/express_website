const notyf = new Notyf({ position: { x: "right", y: "top" } })

async function fetchUsers() {
  try {
    $.ajax({
      url: "/api/user",
      type: "GET",
      success: function (response) {
        let users = response.data.users

        $("#table-header").empty()
        $("#user-table-body").empty()

        // Generate column headers based on preferredOrder
        preferredOrder.forEach(function (column) {
          $("#table-header").append(`<th>${column}</th>`)
        })
        $("#table-header").append("<th>Actions</th>")

        // Populate the table body with users' data
        users.forEach(function (user) {
          const row = $("<tr></tr>")
          preferredOrder.forEach(function (column) {
            row.append(`<td>${user[column]}</td>`)
          })
          row.append(`
                    <td>
                        <button class="edit-btn" onclick="openEditModal('${user.id}', '${JSON.stringify(user)}')">Edit</button>
                        <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                `)
          $("#user-table-body").append(row)
        })

        notyf.success("Refreshed data!")
      },
      error: function (xhr, status, error) {
        console.error("Error fetching users:", error)
        notyf.error(`Unable to refresh data.<br>Error: ${error}`)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

function searchUsers() {
  const input = document.getElementById("search-input").value.toLowerCase()
  const rows = document.querySelectorAll("#user-table-body tr")

  rows.forEach((row) => {
    let found = false
    row.querySelectorAll("td").forEach((cell) => {
      if (cell.textContent.toLowerCase().includes(input)) {
        found = true
      }
    })

    row.style.display = found ? "" : "none"
  })
}

function openEditModal(userId, userData) {
  userData = JSON.parse(userData)
  // Set user ID in modal
  document.getElementById("edit-user-id").value = userId

  // Iterate over userData and update corresponding input fields dynamically
  Object.keys(userData).forEach((key) => {
    const inputField = document.getElementById(`edit-${key}`)
    if (inputField) {
      inputField.value = userData[key]
    }
  })

  document.getElementById("editUserModal").style.display = "block"
}

function closeEditModal() {
  document.getElementById("editUserModal").style.display = "none"
}

document.getElementById("editUserForm").addEventListener("submit", async function (event) {
  event.preventDefault()

  const userId = document.getElementById("edit-user-id").value
  const updatedUser = {}

  // Loop through all form inputs (excluding the user ID input)
  const formInputs = document.querySelectorAll('#editUserForm input[type="text"]')
  formInputs.forEach((input) => {
    const fieldName = input.id.replace("edit-", "") // Remove 'edit-' prefix
    updatedUser[fieldName] = input.value // Assign input value to correct field in updatedUser
  })

  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    })

    if (response.ok) {
      alert("User updated successfully!")
      fetchUsers() // Refresh the user list
      closeEditModal()
    } else {
      alert("Failed to update user.")
    }
  } catch (error) {
    console.error("Error updating user:", error)
  }
})

async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return

  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: "DELETE"
    })

    if (response.ok) {
      alert("User deleted successfully!")
      fetchUsers() // Refresh the user list
    } else {
      alert("Failed to delete user.")
    }
  } catch (error) {
    console.error("Error deleting user:", error)
  }
}
