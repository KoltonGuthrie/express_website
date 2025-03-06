const notyf = new Notyf({ position: { x: "right", y: "top" } })

$(document).ready(function () {
  if (window.location.hash === "#success") {
    notyf.success("Settings saved!")
    window.location.hash = ""
  }

  $("#settings-form").submit(function (e) {
    e.preventDefault()

    let formData = $(this).serialize()

    $.ajax({
      url: "/api/settings",
      type: "POST",
      data: formData,
      success: function (response) {
        if (response.success) {
          console.log("Settings saved successfully!")
          window.location.hash = "success"
          window.location.reload()
        } else {
          console.error("An error occurred while saving the settings.")
          notyf.error(`Unable to save settings.<br>Error: ${response.message}`)
        }
      },
      error: function (xhr, status, error) {
        console.error("An error occurred while saving the settings.")
        notyf.error(`Unable to save settings.<br>Error: ${error}`)
      }
    })
  })
})
