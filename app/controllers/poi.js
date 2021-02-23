const Poi = {
  index: {
    handler: function (request, h) {
      return h.view("main", { title: "Points of Interest" });
    },
  },
  signup: {
    handler: function (request, h) {
      return h.view("signup", { title: "Signup for POI" });
    },
  },
  login: {
    handler: function (request, h) {
      return h.view("login", { title: "Login to POI" });
    },
  },
};

module.exports = Poi;
