const Place = require("../models/places");
const Review = require("../models/reviews");

module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let place = await Place.findById(id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  //   console.log(newreview);
  place.reviews.push(newreview);
  await newreview.save();
  await place.save();
  req.flash("success", "New Review Created");
  res.redirect(`/places/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted");
  res.redirect(`/places/${id}`);
};
