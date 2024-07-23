const mongoose = require("mongoose");
const MSchema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new MSchema({
  email: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
