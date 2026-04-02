const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 * Build Management View
 *************************** */
async function buildManagementView(req, res) {
  const nav = await utilities.getNav()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    message: null
  })
}

/* ***************************
 * Build Add Classification View
 *************************** */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav()

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: null,
      message: null   
    })
}

/* ***************************
 * Add Classification
 *************************** */
async function addClassification(req, res) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      message: "The newcar classification was successfully added!"
    })

  } catch (error) {
    console.error("addClassification error:", error)

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name, // ✅ keeps input (stickiness)
      message: "Classification already exists. Try a different name."
    })
  }
}

/* ***************************
 * Build Add Inventory View
 *************************** */
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    message: null,

    // ✅ ALL fields MUST exist
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  })
}

/* ***************************
 * Add Inventory
 *************************** */
async function addInventory(req, res) {
  console.log("BODY:", req.body);
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      message: "Inventory item added successfully."
    })
  } else {
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      message: "Failed to add inventory.",
      errors: null
    })
  }
}

/* ***************************
 * Build Inventory Detail View
 *************************** */
async function buildByInventoryId(req, res) {
  const nav = await utilities.getNav()
  const invId = req.params.id

  const vehicle = await invModel.getInventoryById(invId)

  // ✅ FIXED (no rows anymore)
  if (!vehicle) {
    throw new Error("Vehicle not found")
  }

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle
  })
}

/* ***************************
 * Build inventory by classification view
 *************************** */
async function buildByClassificationId(req, res) {
  const nav = await utilities.getNav()
  const classificationId = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classificationId)

  if (!data || data.length === 0) {
    throw new Error("No vehicles found")
  }

  const grid = await utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: data[0].classification_name,
    nav,
    grid
  })
}

module.exports = {
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  buildByInventoryId,
  buildByClassificationId   
}
