"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  lat: Number,
  lon: Number,
  firstName: String,
  lastName: String,
});

module.exports = Mongoose.model("Poi", poiSchema);
