"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  lat: Number,
  lon: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: String,
});

module.exports = Mongoose.model("Poi", poiSchema);
