const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Inventory detail route
router.get(
  "/detail/:id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// ✅ Intentional error route (ONLY ONE)
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router