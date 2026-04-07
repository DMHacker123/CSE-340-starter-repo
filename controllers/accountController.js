const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const utilities = require("../utilities/");

const accountController = {};

/* ***************************
 * Account Management View
 * ************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
  });
};

/* ****************************************
 *  Deliver login view
 * **************************************** */
accountController.buildLogin = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(),
    errors: null,
  });
};

/* ****************************************
 *  Process Login (JWT version)
 * **************************************** */
accountController.accountLogin = async function (req, res) {
  const { account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    console.log("ACCOUNT DATA:", accountData);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");

      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash(),
      });
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password,
    );
    console.log("PASSWORD MATCH:", passwordMatch);

    if (passwordMatch) {
      delete accountData.account_password;

      // ✅ Only send necessary data in token
      const tokenData = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
      };

      const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      });

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 3600 * 1000,
      });

      return res.redirect("/account/");
    }

    req.flash("notice", "Incorrect password.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    return res.status(500).render("errors/error", {
      title: "Server Error",
      message: error.message,
    });
  }
};

/* ****************************************
 *  Deliver registration view
 * **************************************** */
accountController.buildRegister = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
};

/* ****************************************
 *  Process Registration
 * **************************************** */
accountController.registerAccount = async function (req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const nav = await utilities.getNav();

  try {
    const emailExists = await accountModel.checkExistingEmail(account_email);

    if (emailExists) {
      req.flash("notice", "Email already exists.");

      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
    );

    if (regResult) {
      req.flash("notice", "Congratulations, registration successful!");
      return res.redirect("/account/login");
    }
  } catch (error) {
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};

/* ****************************************
 *  Build Update Account View
 * **************************************** */
accountController.buildUpdateView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);

  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    errors: null,
  });
};

/* ****************************************
 *  Update Account Info
 * **************************************** */
accountController.updateAccount = async function (req, res) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (result) {
    req.flash("notice", "Account updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Update failed.");
    res.redirect(`/account/update/${account_id}`);
  }
};

/* ****************************************
 *  Update Password
 * **************************************** */
accountController.updatePassword = async function (req, res) {
  const { account_id, account_password } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);

  const result = await accountModel.updatePassword(account_id, hashedPassword);

  if (result) {
    req.flash("notice", "Password updated.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Password update failed.");
    res.redirect(`/account/update/${account_id}`);
  }
};

/* ****************************************
 *  Logout
 * **************************************** */
accountController.logout = function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
};

accountController.buildUpdateView = async function (req, res) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);

  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
};

module.exports = accountController;
