const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return next({ status: 404, message: "No vehicles found." })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    console.log("Classification ID:", classification_id)
    console.log("Returned Data:", data)

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid, // grid contains formatted HTML or structured data
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Build inventory detail
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.id)
    const vehicle = await invModel.getInventoryById(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle, // pass the object to template
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Intentional Error Function
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing")
}

module.exports = invCont