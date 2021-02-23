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
  addPoi: {
    handler: function (request, h) {
      const data = request.payload;
      var userEmail = request.auth.credentials.id;
      data.user = this.users[userEmail];
      this.poi.push(data);
      return h.redirect("/report");
    },
  },
};

module.exports = Poi;
