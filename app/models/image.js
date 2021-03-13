"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  public_id: String,
});

module.exports = Mongoose.model("Image", imageSchema);
