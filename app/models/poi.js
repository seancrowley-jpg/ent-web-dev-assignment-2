"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  lat: Number,
  lon: Number,
});

module.exports = Mongoose.model("Poi", poiSchema);
