const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// ✅ MUST BE HERE (TOP)
const {
  classificationValidate,
  inventoryValidate,
  handleErrors
} = require("../utilities/inventory-validation")

// Routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:id",
  utilities.handleErrors(invController.buildByInventoryId)
)

router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

router.get("/", invController.buildManagementView)

router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  classificationValidate,
  handleErrors,
  invController.addClassification
)

console.log("DEBUG:", {
  classificationValidate,
  inventoryValidate,
  handleErrors,
  addClassification: invController.addClassification,
  addInventory: invController.addInventory
})
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  inventoryValidate,
  handleErrors,
  invController.addInventory
)

module.exports = router