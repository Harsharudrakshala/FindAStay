const express = require("express");
const router = express.Router();
const Place = require("../models/places.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const placeController = require("../controllers/place.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router.get("/", wrapAsync(placeController.index));
router.get("/about", placeController.about);
//New Route
router.get("/new", isLoggedIn, placeController.addNewPlace);
//Show MyPlaces
router.get("/myplaces", isLoggedIn, wrapAsync(placeController.myPlaces));
//Show Route

router.post("/search", wrapAsync(placeController.search));

router.get("/:id", wrapAsync(placeController.showPlace));

//create place
router.post(
  "/",
  isLoggedIn,
  upload.single("place[image]"),
  wrapAsync(placeController.createPlace)
);
//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(placeController.editForm)
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("place[image]"),
  wrapAsync(placeController.editPlace)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(placeController.deletePlace)
);

module.exports = router;
