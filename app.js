if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dURL = process.env.MDBATLAS;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const placesRouter = require("./allroutes/place.js");
const reviewsRouter = require("./allroutes/review.js");
const userRouter = require("./allroutes/user.js");
const ExpressError = require("./utilities/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const localStrategy = require("passport-local");

const store = MongoStore.create({
  mongoUrl: dURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Some error occured", err);
});

const options = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(options));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("database connected");
  })
  .catch((er) => {
    console.log(er);
  });
async function main() {
  await mongoose.connect(dURL);
}
// app.get("/", (req, res) => {
//   res.send("Hello");
// });
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

app.use("/places", placesRouter);
app.use("/places/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
//Error Handler

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  if (res.headersSent) {
    return;
  }
  // res.status(statuscode).send(message);
  res.status(statuscode).render("error.ejs", { message });
});
app.listen(3030, () => {
  console.log("server is on port 3030");
});
