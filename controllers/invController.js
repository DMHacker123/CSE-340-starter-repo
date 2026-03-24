const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classification_id)

  if (!data || data.length === 0) {
    return next({ status: 404, message: "No vehicles found." })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory detail
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.id

  const data = await invModel.getInventoryById(inv_id)

  if (!data) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  const nav = await utilities.getNav()
  const vehicleHTML = utilities.buildVehicleDetail(data)

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleHTML,
  })
}

/* ***************************
 * Intentional Error Function
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing")
}

module.exports = invCont