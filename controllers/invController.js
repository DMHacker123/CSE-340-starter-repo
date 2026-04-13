const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const reviewModel = require("../models/review-model");
const invController = {};

/* ***************************
 * Build Management View
 *************************** */
invController.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  const message = req.flash("notice");

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    message,
  });
};

/* ***************************
 * Build Add Classification View
 *************************** */
invController.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: null,
    message: null,
  });
};

/* ***************************
 * Add Classification
 *************************** */
invController.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body;

    await invModel.addClassification(classification_name);

    req.flash("notice", "The new classification was successfully added!");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("notice", "Classification already exists.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 * Build Add Inventory View
 *************************** */
invController.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    message: null,

    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  });
};

/* ***************************
 * Add Inventory
 *************************** */
invController.addInventory = async function (req, res) {
  try {
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
      classification_id,
    } = req.body;

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
      classification_id,
    );

    if (result) {
      req.flash("notice", "Inventory item added successfully.");
      return res.redirect("/inv/");
    } else {
      req.flash("notice", "Failed to add inventory.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    req.flash("notice", "Error adding inventory.");
    res.redirect("/inv/add-inventory");
  }
};

/* ***************************
 * Build Inventory Detail View
 *************************** */
invController.buildByInventoryId = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();

    const invId = req.params.id; // ✅ FIRST

    console.log("INV ID:", invId);

    const vehicle = await invModel.getInventoryById(invId);

    const reviews = await reviewModel.getReviewsByInvId(invId);

    console.log("REVIEWS:", reviews);

    res.render("inventory/detail", {
      title: vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicle,
      reviews: reviews || [],
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build by Classification
 *************************** */
invController.buildByClassificationId = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationId = req.params.classificationId;

  const data = await invModel.getInventoryByClassificationId(classificationId);

  if (!data || data.length === 0) {
    throw new Error("No vehicles found");
  }

  const grid = await utilities.buildClassificationGrid(data);

  res.render("inventory/classification", {
    title: data[0].classification_name,
    nav,
    grid,
  });
};

/* ***************************
 * Get Inventory JSON
 *************************** */
invController.getInventoryJSON = async function (req, res) {
  const classification_id = parseInt(req.params.classification_id);

  const data = await invModel.getInventoryByClassificationId(classification_id);

  res.json(data || []);
};

/* ***************************
 * Edit Inventory View
 *************************** */
invController.editInventoryView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);

  const invData = await invModel.getInventoryById(inv_id);

  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(
    invData.classification_id,
  );

  res.render("inventory/edit-inventory", {
    title: `Edit ${invData.inv_make} ${invData.inv_model}`,
    nav,
    classificationList,
    errors: null,
    invData,
  });
};

/* ***************************
 * Delete View
 *************************** */
invController.buildDeleteView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    itemName,
    inv_id,
    invData: itemData,
  });
};

/* ***************************
 * Delete Inventory
 *************************** */
invController.deleteInventory = async function (req, res) {
  const { inv_id } = req.body;

  const result = await invModel.deleteInventory(inv_id);

  if (result) {
    req.flash("notice", "Item deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

/* ***************************
 * Update Inventory
 *************************** */
invController.updateInventory = async function (req, res) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const result = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (result) {
    req.flash("notice", "Item updated successfully.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Update failed.");
    res.redirect(`/inv/edit/${inv_id}`);
  }
};

module.exports = invController;
