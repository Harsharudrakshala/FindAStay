const Place = require("./models/places");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let place = await Place.findById(id);
  if (!place.owner._id.equals(res.locals.curruser._id)) {
    req.flash("error", "You don't have permission to do this");
    return res.redirect(`/places/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let place = await Review.findById(reviewid);
  try {
    if (!review.author._id.equals(res.locals.curruser._id)) {
      req.flash("error", "You don't have permission to do delete");
      return res.redirect(`/places/${id}`);
    }
  } catch (e) {
    return next(e);
  }
  next();
};
