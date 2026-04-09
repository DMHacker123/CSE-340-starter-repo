require("dotenv").config();
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");

const accountController = {};

/* Account dashboard */
accountController.buildAccountManagement = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData, // ✅ IMPORTANT
  });
};

/* Login view */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/login", {
    title: "Login",
    nav,
    errors: [],
    messages: req.flash ? req.flash() : {},
  });
};

/* Login process */
accountController.accountLogin = async function (req, res) {
  console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET);

  const { account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Invalid credentials.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash(),
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
        secure: process.env.NODE_ENV === "production",
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
        errors: null,
        messages: req.flash(),
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

/* Register */
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
      req.flash("notice", "Email exists.");
      return res.render("account/register", { title: "Register", nav });
    }

    const hash = await bcrypt.hash(account_password, 10);

    await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hash,
    );

    req.flash("notice", "Registered successfully.");
    res.redirect("/account/login");
  } catch (err) {
    res.status(500).send("Server error");
  }
};

/* Register view */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash(),

    // ✅ ADD THESE DEFAULT VALUES
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
};

/* Build update page */
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

/* Update account info */
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
    req.flash("notice", "Account updated.");
    return res.redirect("/account/");
  }

  req.flash("notice", "Update failed.");
  res.redirect(`/account/update/${account_id}`);
};

/* Update password */
accountController.updatePassword = async function (req, res) {
  const { account_id, account_password } = req.body;

  try {
    const hash = await bcrypt.hash(account_password, 10);

    const result = await accountModel.updatePassword(account_id, hash);

    if (result) {
      req.flash("notice", "Password updated.");
      return res.redirect("/account/");
    }

    req.flash("notice", "Update failed.");
    res.redirect(`/account/update/${account_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* Logout */
accountController.logout = function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "Logged out.");
  res.redirect("/");
};

module.exports = accountController;
