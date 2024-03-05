const campGround = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const cgrounds = await campGround.find({});
  res.render("campgrounds/index", { cgrounds });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
};
module.exports.createNewCampGround = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  // if (!req.body) throw new ExpressError("Invalid", 400);
  const { title, location, image, description, price } = req.body;
  const newG = new campGround({
    title: title,
    location: location,
    image: image,
    description: description,
    price: price,
    author: req.user._id,
  });
  newG.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newG.geometry = geoData.body.features[0].geometry;
  await newG.save();
  req.flash("success", "Successfully added a new campground");
  res.redirect(`/campgrounds/${newG._id}`);
};

module.exports.showCampGround = async (req, res, next) => {
  const { id } = req.params;
  const cground = await campGround
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!cground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { cground });
};

module.exports.renderEditCampGroundForm = async (req, res, next) => {
  const { id } = req.params;
  const ground = await campGround.findById(id);
  if (!ground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { ground });
};

module.exports.editCampGround = async (req, res, next) => {
  const { id } = req.params;
  const { title, location, image, description, price, author } = req.body;
  const newG = await campGround.findByIdAndUpdate(id, {
    title,
    location,
    image,
    description,
    price,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newG.image.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await newG.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await newG.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampGround = async (req, res, next) => {
  const { id } = req.params;
  await campGround.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
