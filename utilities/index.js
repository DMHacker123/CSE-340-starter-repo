const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* JWT FUNCTION */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decodedJWT) {
        if (err) {
          res.locals.accountData = null
          return next()
        }

        res.locals.accountData = decodedJWT

        next()
      }
    )
  } else {
    res.locals.accountData = null
    next()
  }
}

/* NAV */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/">Home</a></li>'

  data.rows.forEach(row => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}">
        ${row.classification_name}
      </a>
    </li>`
  })

  list += "</ul>"
  return list
}

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ************************
 * Classification Grid
 ************************ */
Util.buildClassificationGrid = function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<ul id="inv-display">'

    data.forEach(vehicle => {
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

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      </div>
      <div class="vehicle-info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Price:</strong> $${data.inv_price}</p>
        <p><strong>Mileage:</strong> ${data.inv_miles} miles</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
      </div>
    </div>
  `
}

/* ************************
 * Classification List
 ************************ */
Util.buildClassificationList = async function () {
  let data = await invModel.getClassifications()

  let list = '<select name="classification_id" id="classification_id">'
  list += '<option value="">Choose a Classification</option>'

  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}">
      ${row.classification_name}
    </option>`
  })

  list += '</select>'
  return list
}

function checkEmployeeOrAdmin(req, res, next) {
  if (res.locals.accountData) {
    const type = res.locals.accountData.account_type

    if (type === "Employee" || type === "Admin") {
      return next()
    }
  }

  req.flash("notice", "You must be an Employee or Admin to access this page.")
  return res.redirect("/account/login")
}

/* EXPORT EVERYTHING */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildVehicleDetail: Util.buildVehicleDetail,
  handleErrors: Util.handleErrors,
  buildClassificationList: Util.buildClassificationList,
  checkJWTToken,
  checkEmployeeOrAdmin
}