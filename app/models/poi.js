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
  image: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
  reviews: [
    {
      writtenBy: String,
      review: String
    }
  ]
});

module.exports = Mongoose.model("Poi", poiSchema);
