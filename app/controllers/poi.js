const Walk = require("../models/poi");
const User = require("../models/user");

const Poi = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a Point of Interest" });
    },
  },
  report: {
    handler: async function (request, h) {
      const pois = await Walk.find().populate("user").lean();
      return h.view("report", {
        title: "View Points of Interest",
        poi: pois,
      });
    },
  },
  userReport: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const pois = await Walk.find({ user: user._id }).populate("user").lean();
      return h.view("user-report", {
        title: "My Points of Interest",
        poi: pois,
      });
    },
  },
  addPoi: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newWalk = new Walk({
        name: data.name,
        description: data.description,
        lat: data.lat,
        lon: data.lon,
        user: user._id,
      });
      await newWalk.save();
      return h.redirect("/report");
    },
  },
};

module.exports = Poi;
