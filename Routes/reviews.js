const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controller/reviews");
const catchAsync = require("../Utils/catchAsync");

// Add Review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.addReview));

// Delete Review
router.delete(
  "/:id2",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
