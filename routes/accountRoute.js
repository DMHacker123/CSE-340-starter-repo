const express = require("express");
const router = new express.Router();

const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

// Account dashboard
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement),
);

console.log("registrationRules:", validate.registrationRules);
console.log("checkRegData:", validate.checkRegData);
console.log("registerAccount:", accountController.registerAccount);

// Register
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister),
);
router.post(
  "/login",
  ...validate.loginRules(), // ✅ MUST spread
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

// Logout
router.get("/logout", accountController.logout);

// Update account + password (SAME PAGE)
router.get("/update/:account_id", accountController.buildUpdateView);
router.post("/update", accountController.updateAccount);
router.post("/update-password", accountController.updatePassword);

router.post(
  "/register",
  ...validate.registrationRules(), // ✅ MUST spread
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

module.exports = router;
