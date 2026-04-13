const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* JWT FUNCTION */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decodedJWT) {
        if (err) {
          res.locals.accountData = null;
          return next();
          console.log("JWT DATA:", decodedJWT);
        }

        res.locals.accountData = decodedJWT;

        next();
      },
    );
  } else {
    res.locals.accountData = null;
    next();
  }
}

/* NAV */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/">Home</a></li>';

  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}">
        ${row.classification_name}
      </a>
    </li>`;
  });

  list += "</ul>";
  return list;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Classification Grid
 ************************ */
Util.buildClassificationGrid = function (data) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';

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
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>
      `;
    });

    grid += "</ul>";
  } else {
    grid = '<p class="notice">No vehicles found.</p>';
  }

  return grid;
};

/* ************************
 * Vehicle Detail
 ************************ */
Util.buildVehicleDetail = function (data) {
  if (!data) return '<p class="notice">No vehicle found.</p>';

  return `
    <div class="vehicle-detail">

  <div class="vehicle-info">
    <h2><%= vehicle.inv_make %> <%= vehicle.inv_model %></h2>

    <p><strong>Year:</strong> <%= vehicle.inv_year %></p>
    <p><strong>Price:</strong> $<%= vehicle.inv_price %></p>
    <p><strong>Miles:</strong> <%= vehicle.inv_miles %> miles</p>
    <p><strong>Color:</strong> <%= vehicle.inv_color %></p>
    <p><strong>Description:</strong> <%= vehicle.inv_description %></p>

    <img src="<%= vehicle.inv_image %>" alt="<%= vehicle.inv_model %>" />
  </div>

  <div class="reviews-section">
    <h2>Leave a Review</h2>

    <% if (accountData) { %>
      <form action="/reviews/add" method="POST">
        <textarea name="review_text" required></textarea>
        <input type="hidden" name="inv_id" value="<%= vehicle.inv_id %>">
        <button type="submit">Submit Review</button>
      </form>
    <% } else { %>
      <p>Please log in to leave a review.</p>
    <% } %>

    <h2>Customer Reviews</h2>

    <% if (reviews && reviews.length > 0) { %>
      <% reviews.forEach(review => { %>
        <div class="review">
          <strong>
            <%= review.account_firstname %> <%= review.account_lastname %>
          </strong>
          <p><%= review.review_text %></p>
          <small><%= review.review_date %></small>
        </div>
        <hr>
      <% }) %>
    <% } else { %>
      <p>No reviews yet.</p>
    <% } %>
  </div>

</div>
  `;
};

/* ************************
 * Classification List
 ************************ */
Util.buildClassificationList = async function () {
  let data = await invModel.getClassifications();

  let list = '<select name="classification_id" id="classification_id">';
  list += '<option value="">Choose a Classification</option>';

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}">
      ${row.classification_name}
    </option>`;
  });

  list += "</select>";
  return list;
};

function checkEmployeeOrAdmin(req, res, next) {
  if (res.locals.accountData) {
    const type = res.locals.accountData.account_type;

    if (type === "Employee" || type === "Admin") {
      return next();
    }
  }

  req.flash("notice", "You must be an Employee or Admin to access this page.");
  return res.redirect("/account/login");
}

function checkLogin(req, res, next) {
  if (res.locals.accountData) {
    return next();
  }

  req.flash("notice", "Please log in.");
  return res.redirect("/account/login");
}

/* EXPORT EVERYTHING */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildVehicleDetail: Util.buildVehicleDetail,
  handleErrors: Util.handleErrors,
  buildClassificationList: Util.buildClassificationList,
  checkJWTToken,
  checkEmployeeOrAdmin,
  checkLogin,
};
