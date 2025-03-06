$(document).ready(function () {
  $("#settings-form").submit(function (e) {
    e.preventDefault()

    let formData = $(this).serialize()

    $.ajax({
      url: "/api/settings",
      type: "POST",
      data: formData,
      success: function (response) {
        console.log("Settings saved successfully!")
        console.log(response)
        if (response.success) {
          window.location.reload()
        }
      },
      error: function (xhr, status, error) {
        console.error("An error occurred while saving the settings.")
        console.log(error)
      }
    })
  })
})
