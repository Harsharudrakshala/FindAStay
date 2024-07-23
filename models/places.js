const mongoose = require("mongoose");
const MSchema = mongoose.Schema;
const Review = require("./reviews.js");

const placesSchema = new MSchema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: MSchema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: MSchema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["room", "house", "apartment"],
  },
  contact: {
    type: String,
  },
});

placesSchema.post("findOneAndDelete", async (place) => {
  if (place) {
    await Review.deleteMany({ _id: { $in: place.reviews } });
  }
});

const Place = mongoose.model("Place", placesSchema);
module.exports = Place;
