const User = require("../models/users");

module.exports.signUpForm = (req, res) => {
  return res.render("./users/signup");
};

module.exports.loginForm = (req, res) => {
  return res.render("./users/login");
};

module.exports.postSignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const reguser = await User.register(newuser, password);
    req.login(reguser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to findAStay");
      return res.redirect("/places");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome to findAStay");
  res.redirect("/places");
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/places");
  });
};
