const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("userData", User, "userData");
