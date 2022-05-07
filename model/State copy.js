const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  state: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: false,
  },
  nickname: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  admission_date: {
    type: String,
    required: false,
  },
  admission_number: {
    type: Number,
    required: false,
  },
  slug: {
    type: String,
    required: false,
  },
  capital_city: {
    type: String,
    required: false,
  },
  capital_url: {
    type: String,
    required: false,
  },
  population: {
    type: Number,
    required: false,
  },
  population_rank: {
    type: Number,
    required: false,
  },
  constitution_url: {
    type: String,
    required: false,
  },
  state_flag_url: {
    type: String,
    required: false,
  },
  state_seal_url: {
    type: String,
    required: false,
  },
  map_image_url: {
    type: String,
    required: false,
  },
  landscape_background_url: {
    type: String,
    required: false,
  },
  skyline_background_url: {
    type: String,
    required: false,
  },
  twitter_url: {
    type: String,
    required: false,
  },  
  facebook_url: {
    type: String,
    required: false,
  },
  funfacts: [String]
});

module.exports = mongoose.model("State", stateSchema);
