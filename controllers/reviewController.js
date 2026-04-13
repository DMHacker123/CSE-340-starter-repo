const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

/* Add Review */
reviewController.addReview = async (req, res) => {
  const { review_text, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  if (!review_text) {
    req.flash("notice", "Review cannot be empty.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  const result = await reviewModel.addReview(review_text, inv_id, account_id);

  if (result) {
    req.flash("notice", "Review added successfully!");
  } else {
    req.flash("notice", "Failed to add review.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
};

module.exports = reviewController;
