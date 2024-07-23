const express = require("express");
const { register } = require("../models/users");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.get("/signup", wrapAsync(userController.signUpForm));

router.get("/login", wrapAsync(userController.loginForm));

router.post("/signup", wrapAsync(userController.postSignUp));

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.postLogin)
);

router.get("/logout", userController.logoutUser);

module.exports = router;
