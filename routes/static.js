const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {

  const vehicles = [
    { name: "Toyota Camry", image: "camry.jpg" },
    { name: "Honda Accord", image: "accord.jpg" }
  ]

  res.render("index", {
    title: "Home",
    vehicles
  })
})

router.get("/sedan", (req, res) => {

  const vehicles = [
    { name: "Toyota Camry", image: "/images/vehicles/camaro.jpg" },
    { name: "Honda Accord", image: "/images/vehicles/delorean.jpg" },
    { name: "Hyundai Elantra", image: "/images/vehicles/wrangler.jpg" }
  ]

  res.render("sedan", {
    title: "Sedan",
    vehicles
  })
})

router.get("/suv", (req, res) => {

  const vehicles = [
    { name: "Hummer", image: "/images/vehicles/hummer.jpg" },
    { name: "Cadillac Escalade", image: "/images/vehicles/escalade.jpg" }
  ]

  res.render("suv", {
    title: "SUV",
    vehicles
  })
})

router.get("/truck", (req, res) => {

  const vehicles = [
    { name: "Monster Truck", image: "/images/vehicles/monster-truck.jpg" },
    { name: "Fire Truck", image: "/images/vehicles/fire-truck.jpg" },
    { name: "Hummer", image: "/images/vehicles/hummer.jpg" }
  ]

  res.render("truck", {
    title: "Truck",
    vehicles
  })
})

router.get("/custom", (req, res) => {

  const vehicles = [
    { name: "Custom Jeep Wrangler", image: "/images/vehicles/wrangler.jpg" }
  ]

  res.render("custom", {
    title: "Custom",
    vehicles
  })
})

module.exports = router