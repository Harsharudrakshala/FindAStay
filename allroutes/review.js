const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const Place = require("../models/places.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//Create Review
router.post("/", isLoggedIn, wrapAsync(reviewController.postReview));

//Delete Review
router.delete(
  "/:reviewid",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
