const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

router.get("/custom", (req, res) => {
  res.render("custom", { title: "Custom" })
})

router.get("/sedan", (req, res) => {
  res.render("sedan", { title: "Sedan" })
})

router.get("/suv", (req, res) => {
  res.render("suv", { title: "SUV" })
})

router.get("/truck", (req, res) => {
  res.render("truck", { title: "Truck" })
})

module.exports = router