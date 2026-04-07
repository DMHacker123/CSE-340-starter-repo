const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const {
  classificationValidate,
  inventoryValidate,
  handleErrors
} = require("../utilities/inventory-validation")

console.log("checkJWTToken:", utilities.checkJWTToken)
console.log("checkEmployeeOrAdmin:", utilities.checkEmployeeOrAdmin)
console.log("buildManagementView:", invController.buildManagementView)

// Routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// ✅ REMOVE ERROR ROUTE (not implemented)
// router.get("/error", ...)

router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagementView)
)

router.get("/add-classification", invController.buildAddClassification)

router.post(
  "/add-classification",
  classificationValidate,
  handleErrors,
  invController.addClassification
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get("/edit/:inv_id", invController.editInventoryView)

router.get("/add-inventory", invController.buildAddInventory)

router.post(
  "/add-inventory",
  inventoryValidate,
  handleErrors,
  invController.addInventory
)

// ✅ DELETE ROUTES
router.get("/delete/:inv_id", invController.buildDeleteView)
router.post("/delete/", invController.deleteInventory)
router.post(
  "/update-inventory",
  inventoryValidate,
  handleErrors,
  invController.updateInventory
)
module.exports = router