const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Classification view
router.get(
  "/detail/:id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// ✅ Inventory detail route (FINAL FIX)
router.get(
  "/detail/:id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// Error test route
router.get(
  "/error",
  utilities.handleErrors(async (req, res) => {
    throw new Error("Intentional server error")
  })
)

module.exports = router