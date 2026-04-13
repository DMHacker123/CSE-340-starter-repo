const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
console.log(reviewController);
// Add review (protected)
router.post(
  "/add",
  utilities.checkJWTToken, // ✅ works
  utilities.handleErrors(reviewController.addReview),
);

module.exports = router;
