const Place = require("../models/places");

module.exports.index = async (req, res) => {
  const typeFilter = req.query.type;
  // allPlaces = await Place.find({});

  let query = Place.find({});

  if (typeFilter) {
    query = query.where("type").equals(typeFilter);
  }

  const allPlaces = await query.exec();
  res.render("index.ejs", { allPlaces });
};

module.exports.addNewPlace = (req, res) => {
  res.render("new.ejs");
};

module.exports.about = (req, res) => {
  res.render("about.ejs");
};

module.exports.showPlace = async (req, res) => {
  let { id } = req.params;
  const place = await Place.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!place) {
    req.flash("error", "Place you requested doesn't exist");
    return res.redirect("/places");
  }
  res.render("show.ejs", { place });
};

module.exports.search = async (req, res) => {
  const searchQuery = req.body.searchQ;

  const searchResults = await Place.find({
    title: { $regex: new RegExp(searchQuery, "i") },
  });

  res.render("search.ejs", { searchResults });
};

module.exports.myPlaces = async (req, res) => {
  let myPlaces = await Place.find({ owner: req.user._id });
  //console.log("hello");
  res.render("myplaces.ejs", { myPlaces });
};

module.exports.createPlace = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let place = req.body.place;
  if (!place) {
    throw new ExpressError(400, "Send valid data");
  }
  const newPlace = new Place(place);
  newPlace.owner = req.user._id;
  newPlace.image = { url, filename };
  if (!newPlace.title) {
    throw new ExpressError(400, "Title is missing");
  }
  if (!newPlace.description) {
    throw new ExpressError(400, "Description is missing");
  }
  if (!newPlace.price) {
    throw new ExpressError(400, "Price is missing");
  }
  if (!newPlace.location) {
    throw new ExpressError(400, "Location is missing");
  }
  if (!newPlace.country) {
    throw new ExpressError(400, "Country is missing");
  }
  await newPlace.save();
  req.flash("success", "New Place Created");
  res.redirect("/places");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const place = await Place.findById(id);
  if (!place) {
    req.flash("error", "Place you requested doesn't exist");
    return res.redirect("/places");
  }
  res.render("edit.ejs", { place });
};

module.exports.editPlace = async (req, res) => {
  if (!req.body.place) {
    throw new ExpressError(400, "Send valid data");
  }
  let { id } = req.params;

  let place = await Place.findByIdAndUpdate(id, { ...req.body.place });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    place.image = { url, filename };
    await place.save();
  }
  req.flash("success", "Modifications done");
  res.redirect(`/places/${id}`);
};

module.exports.deletePlace = async (req, res) => {
  let { id } = req.params;
  const deletedplace = await Place.findByIdAndDelete(id);
  req.flash("success", "Place Deleted");
  res.redirect("/places");
};
