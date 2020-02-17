var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Worker                = require("./Worker");

var ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  worker: {
    type: [Worker]
  },
  address: {
    type: String
  },
  photos: {
    type: [String]
  },
  registration_number: {
    type: String,
    required: true,
    unique: true
  },
  services: {
    type: [String]
  },
  reviews: {
    type: [{
      rating: Number,
      comment: String
    }]
  },
  overall_rating: {
    type: Number
  },
  number_of_reviews: {
    type: Number
  }
});

ShopSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Shop", ShopSchema);
