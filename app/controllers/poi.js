const Poi = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a Point of Interest" });
    },
  },
  report: {
    handler: function (request, h) {
      return h.view("report", { title: "View Points of Interest" });
    },
  },
};

module.exports = Poi;
