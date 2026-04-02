const validate = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// GET login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

module.exports = router