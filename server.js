const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static("public"))
app.set("layout", "./layouts/layout")

/* ***********************
 * Index route
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * Inventory routes
 *************************/
app.use("/inv", inventoryRoute)

/* ***********************
 * Error route (INTENTIONAL 500)
 *************************/

/* ***********************
 * 404 Not Found Route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Error Handler (handles BOTH 404 & 500)
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Server Listener
 *************************/
const port = process.env.PORT || 5500

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})