const Poi = require("./app/controllers/poi");

module.exports = [{ method: "GET", path: "/", config: Poi.index }];
