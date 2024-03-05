if (process.env.Node_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const campGround = require("../models/campground");

const dbURL = process.env.dbURL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.log(e);
    mongoose.connection.close();
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campGround.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new campGround({
      title: `${sample(descriptors)}, ${sample(places)}`,
      price,
      image: [
        {
          url: "https://res.cloudinary.com/de1omnwjh/image/upload/v1708789492/YelpSelf/Seeds/alberta-2297204_lczziy.jpg",
          filename: "YelpSelf/Seeds/alberta-2297204_lczziy",
        },
        {
          url: "https://res.cloudinary.com/de1omnwjh/image/upload/v1708789492/YelpSelf/Seeds/sports-car-1374425_jltnn1.jpg",
          filename: "YelpSelf/Seeds/sports-car-1374425_jltnn1",
        },
      ],
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus, ipsam!",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      author: "65da1331fffaefac889f115e",
    });
    await c.save();
  }
};
const util = async () => {
  await seedDB();
  console.log("Data Added");
  mongoose.connection.close();
};

util();
