const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const utilities = require("../utilities/");

const accountController = {};

/* ***************************
 *  Account Management View
 * ************************** */
accountController.buildAccountManagement = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
  });
};

/* ***************************
 *  Login View
 * ************************** */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(),
    errors: null,
  });
};

/* ***************************
 *  Login Process
 * ************************** */
accountController.accountLogin = async function (req, res) {
  const { account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Invalid credentials.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
      });
    }

    const match = await bcrypt.compare(
      account_password,
      accountData.account_password,
    );

    if (match) {
      delete accountData.account_password;

      const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // for localhost
        sameSite: "lax",
        path: "/",
        maxAge: 3600 * 1000,
      });

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Incorrect password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

/* ***************************
 *  Register View
 * ************************** */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash(),
    errors: null,
  });
};

/* ***************************
 *  Register Process
 * ************************** */
accountController.registerAccount = async function (req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const nav = await utilities.getNav();

  try {
    const exists = await accountModel.checkExistingEmail(account_email);

    if (exists) {
      req.flash("notice", "Email already exists.");
      return res.render("account/register", {
        title: "Register",
        nav,
      });
    }

    const hash = await bcrypt.hash(account_password, 10);

    await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hash,
    );

    req.flash("notice", "Registration successful. Please log in.");
    return res.redirect("/account/login");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

/* ***************************
 *  Build Update View
 * ************************** */
accountController.buildUpdateView = async function (req, res) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);

  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    errors: null,
  });
};

/* ***************************
 *  Update Account Info
 * ************************** */
accountController.updateAccount = async function (req, res) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  try {
    const result = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    );

    if (result) {
      req.flash("notice", "Account updated successfully.");
      return res.redirect("/account/");
    }

    req.flash("notice", "Update failed.");
    return res.redirect(`/account/update/${account_id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

/* ***************************
 *  Update Password
 * ************************** */
accountController.updatePassword = async function (req, res) {
  const { account_id, account_password } = req.body;

  try {
    const hash = await bcrypt.hash(account_password, 10);

    const result = await accountModel.updatePassword(account_id, hash);

    if (result) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    }

    req.flash("notice", "Password update failed.");
    return res.redirect(`/account/update/${account_id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

/* ***************************
 *  Logout
 * ************************** */
accountController.logout = function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
};

/* ***************************
 *  Export Controller
 * ************************** */
module.exports = accountController;
