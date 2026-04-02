  const invModel = require("../models/inventory-model")

  const Util = {}

  /* ************************
  * Navigation
  ************************ */
  Util.getNav = async function () {
    let data = await invModel.getClassifications()

    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.rows.forEach((row) => {
      list += "<li>"
      list += `<a href="/inv/type/${row.classification_id}" 
                title="See our inventory of ${row.classification_name} vehicles">
                ${row.classification_name}
              </a>`
      list += "</li>"
    })

    list += "</ul>"
    return list
  }

  /* ************************
  * Classification Grid
  ************************ */
  Util.buildClassificationGrid = function (data) {
    let grid = ""

    if (data.length > 0) {
      grid = '<ul id="inv-display">'

      data.forEach((vehicle) => {
        grid += `
          <li>
            <a href="/inv/detail/${vehicle.inv_id}">
              <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            </a>

            <div class="namePrice">
              <hr />
              <h2>
                <a href="/inv/detail/${vehicle.inv_id}">
                  ${vehicle.inv_make} ${vehicle.inv_model}
                </a>
              </h2>
              <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
            </div>
          </li>
        `
      })

      grid += "</ul>"
    } else {
      grid = '<p class="notice">No vehicles found.</p>'
    }

    return grid
  }

  /* ************************
  * Vehicle Detail
  ************************ */
  Util.buildVehicleDetail = function (data) {
    if (!data) return '<p class="notice">No vehicle found.</p>'

    const price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.inv_price)

    const miles = new Intl.NumberFormat('en-US').format(data.inv_miles)

    return `
      <div class="vehicle-detail">
        <div class="vehicle-image">
          <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        </div>

        <div class="vehicle-info">
          <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Mileage:</strong> ${miles} miles</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
        </div>
      </div>
    `
  }

  /* ************************
  * Error Handler Wrapper
  ************************ */
  Util.handleErrors = fn =>
    (req, res, next) =>
      Promise.resolve(fn(req, res, next)).catch(next)

  Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classification_id">'
    list += '<option value="">Choose a Classification</option>'

    data.rows.forEach(row => {
      list += `<option value="${row.classification_id}">${row.classification_name}</option>`
    })

    list += '</select>'
    return list
  }
  module.exports = Util