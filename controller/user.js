const User = require("../models/user");

module.exports.renderRegistrationForm = (req, res, next) => {
  res.render("user/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res, next) => {
  res.render("user/login");
};

module.exports.login = async (req, res, next) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return next(err);
    }
    req.flash("success", "GoodBye!");
    res.redirect("/");
  });
};
