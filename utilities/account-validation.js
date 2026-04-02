const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ******************************
 * Registration Validation Rules
 * ***************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    body("account_email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)

        if (emailExists) {
        throw new Error("Email already exists. Please log in or use a different email.")
        }
    }),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage(
        "Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      ),
  ]
}

/* ******************************
 * Check Registration Data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}
module.exports = validate
loginRules