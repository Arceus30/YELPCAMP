const mongoose = require("mongoose");
const Review = require("./review");
const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema(
  {
    title: String,
    price: Number,
    image: [imageSchema],
    description: String,
    location: String,
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campGroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<strong><a href='/campgrounds/${this._id}'>
  ${this.title}</a></strong><br> ${this.location}`;
});

campGroundSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

module.exports = model("Campground", campGroundSchema);
