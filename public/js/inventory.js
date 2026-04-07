const classificationList = document.querySelector("#classification_id")

classificationList.addEventListener("change", async function () {
  const classification_id = classificationList.value

  try {
    const response = await fetch(`/inv/getInventory/${classification_id}`)
    const data = await response.json()

    console.log("DATA:", data)

    buildInventoryList(data) // ✅ REQUIRED
  } catch (error) {
    console.error("Error fetching inventory:", error)
  }
})

function buildInventoryList(data) {
  const table = document.querySelector("#inventoryDisplay")

  let html = "<tr><th>Vehicle</th><th>Actions</th></tr>"

  if (data.length > 0) {
    data.forEach(vehicle => {
      html += `
        <tr>
          <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
          <td>
            <a href="/inv/edit/${vehicle.inv_id}">Edit</a> |
            <a href="/inv/delete/${vehicle.inv_id}">Delete</a>
          </td>
        </tr>
      `
    })
  } else {
    html += `<tr><td colspan="2">No data found</td></tr>`
  }

  table.innerHTML = html
}
