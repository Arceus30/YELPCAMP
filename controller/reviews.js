const campGround = require("../models/campground");
const Review = require("../models/review");

module.exports.addReview = async (req, res, next) => {
  const cground = await campGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  cground.reviews.push(review);
  await review.save();
  await cground.save();
  req.flash("success", "Create new Review");
  res.redirect(`/campgrounds/${cground._id}`);
};
module.exports.deleteReview = async (req, res, next) => {
  const { id, id2 } = req.params;
  await campGround.findByIdAndUpdate(id, { $pull: { reviews: id2 } });
  await Review.findByIdAndDelete(id2);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
