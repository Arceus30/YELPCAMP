const express = require("express");
const router = express.Router();
const campgrounds = require("../controller/campgrounds");
const catchAsync = require("../Utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const uploads = multer({ storage });

router
  .route("/")
  // show all
  .get(catchAsync(campgrounds.index))
  //create new ground
  .post(
    isLoggedIn,
    uploads.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNewCampGround)
  );

// Create new ground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  // Show by Id
  .get(catchAsync(campgrounds.showCampGround))
  //edit ground
  .put(
    isLoggedIn,
    isAuthor,
    uploads.array("image"),
    validateCampground,
    catchAsync(campgrounds.editCampGround)
  )
  //delete ground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampGround));

// Edit ground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditCampGroundForm)
);

module.exports = router;
