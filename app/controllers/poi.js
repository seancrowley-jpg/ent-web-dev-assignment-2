const Walk = require("../models/poi");

const Poi = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a Point of Interest" });
    },
  },
  report: {
    handler: async function (request, h) {
      const pois = await Walk.find().lean();
      return h.view("report", {
        title: "View Points of Interest",
        poi: pois,
      });
    },
  },
  addPoi: {
    handler: async function (request, h) {
      const data = request.payload;
      const newWalk = new Walk({
        name: data.name,
        description: data.description,
        lat: data.lat,
        lon: data.lon,
      });
      await newWalk.save();
      return h.redirect("/report");
    },
  },
};

module.exports = Poi;
