const mongoose = require("mongoose");

const Destination = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model(
  "destinationData",
  Destination,
  "destinationData"
);
