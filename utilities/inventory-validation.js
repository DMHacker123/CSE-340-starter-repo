const { body, validationResult } = require("express-validator");
const utilities = require(".");

/* ******************************
 * Validation Rules for Classification
 ****************************** */
const classificationValidate = [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Classification name is required.")
    .bail()
    .matches(/^[A-Za-z]+$/) // letters ONLY (match your UI)
    .withMessage(
      "Classification name must contain only alphabetic characters.",
    ),
];

/* ******************************
 * Validation Rules for Inventory
 ****************************** */
const inventoryValidate = [
  body("inv_make")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Make is required.")
    .bail(),

  body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Model is required.")
    .bail(),

  body("inv_year")
    .isInt({ min: 1000, max: 9999 })
    .withMessage("Year must be a 4-digit number.")
    .bail(),

  body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description is required.")
    .bail(),

  body("inv_image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Image path is required.")
    .bail(),

  body("inv_thumbnail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Thumbnail path is required.")
    .bail(),

  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number.")
    .bail(),

  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a valid number (no commas).")
    .bail(),

  body("inv_color")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Color is required.")
    .bail(),

  body("classification_id")
    .isInt()
    .withMessage("Please select a classification.")
    .bail(),
];

/* ******************************
 * Handle Validation Errors
 ****************************** */
async function handleErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    let classificationList = "";
    if (!req.originalUrl.includes("classification")) {
      classificationList = await utilities.buildClassificationList(
        req.body.classification_id,
      );
    }

    return res.render(
      req.originalUrl.includes("classification")
        ? "inventory/add-classification"
        : "inventory/add-inventory",
      {
        title: req.originalUrl.includes("classification")
          ? "Add New Classification"
          : "Add New Vehicle",
        nav,
        errors: errors.array(),
        classificationList,
        message: null, // ✅ FIX (prevents crash)
        ...req.body,
      },
    );
  }

  next();
}

/* ******************************
 * Export
 ****************************** */
module.exports = {
  classificationValidate,
  inventoryValidate,
  handleErrors,
};
