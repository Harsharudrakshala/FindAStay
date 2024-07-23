const mongoose = require("mongoose");
const indata = require("./data");
const MURL = "mongodb://127.0.0.1:27017/findAStay";
const Place = require("../models/places.js");

main()
  .then(() => {
    console.log("database connected");
  })
  .catch((er) => {
    console.log(er);
  });
async function main() {
  await mongoose.connect(MURL);
}

const initdB = async () => {
  await Place.deleteMany({});
  indata.data = indata.data.map((obj) => ({
    ...obj,
    owner: "668a809a152afd390820cf32",
  }));
  await Place.insertMany(indata.data);
  console.log("data was init");
};

initdB();
