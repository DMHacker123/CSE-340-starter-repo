const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

/* Registration Rules */
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
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ];
};

/* Check Registration Data */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }

  next();
};

/* Login Rules */
validate.loginRules = () => {
  return [
    body("account_email").trim().isEmail().withMessage("Enter a valid email."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

/* Check Login Data */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }

  next();
};

module.exports = validate;
