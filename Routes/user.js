const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../Utils/catchAsync");
const { storeReturnTo } = require("../middleware");
const users = require("../controller/user");

router
  .route("/register")
  .get(users.renderRegistrationForm)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(users.login)
  );

router.get("/logout", users.logout);

module.exports = router;
