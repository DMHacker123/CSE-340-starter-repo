const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash() 
  })
}

/* ****************************************
*  Process Login
* **************************************** */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body

  let nav = await utilities.getNav()

  try {
    // Get user from DB
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
      })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
      })
    }

    // ✅ SUCCESS
    req.session.account = accountData

    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
    return res.redirect("/")
  } catch (error) {
    console.error(error)
    req.flash("notice", "An error occurred during login.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
*  Deliver registration view
* **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  })
}

/* ****************************************
*  Process Registration
* **************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let nav = await utilities.getNav()

  try {
    // ✅ CHECK IF EMAIL EXISTS
    const emailExists = await accountModel.checkExistingEmail(account_email)

    if (emailExists) {
    req.flash("notice", "Email already exists. Please log in or use a different email.")

    return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
    })
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // ✅ REGISTER ACCOUNT
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", "Congratulations, registration successful!")
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, registration failed.")
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
      })
    }

  } catch (error) {
    console.error(error)

    req.flash("notice", "An error occurred during registration.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

async function buildByInventoryId(req, res) {
  const nav = await utilities.getNav()
  const invId = req.params.id

  console.log("ID:", invId)

  const data = await invModel.getInventoryById(invId)

  console.log("DATA:", data) // 👈 THIS IS KEY

  if (!data) {
    throw new Error("No data returned from database")
  }

  res.render("inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicle: data
  })
}

/* ****************************************
*  Export Functions
* **************************************** */
module.exports = {
  buildLogin,
  accountLogin,
  buildRegister,
  registerAccount
}