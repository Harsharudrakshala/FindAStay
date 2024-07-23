const mongoose = require("mongoose");
const MSchema = mongoose.Schema;
const User = require("./users");

const reviewSchema = new MSchema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  dateandtime: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: MSchema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
