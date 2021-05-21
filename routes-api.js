const Pois = require('./app/api/pois');
const Users = require("./app/api/users");
const Images = require("./app/api/images");

module.exports = [
    { method: 'GET', path: '/api/pois', config: Pois.find },
    { method: 'GET', path: '/api/pois/{id}', config: Pois.findOne },
    { method: 'GET', path: '/api/pois/{id}/weather', config: Pois.getWeather },
    { method: 'GET', path: '/api/pois/userpois/{id}', config: Pois.findUserPOIs },
    { method: "POST", path: "/api/pois", config: Pois.create },
    { method: "POST", path: "/api/pois/{id}", config: Pois.addImage },
    { method: "PUT", path: "/api/pois/{id}", config: Pois.editPoi },
    { method: "DELETE", path: "/api/pois/{id}", config: Pois.deleteOne },
    { method: "DELETE", path: "/api/pois", config: Pois.deleteAll },
    { method: "DELETE", path: "/api/pois/{public_id}/image", config: Pois.deleteImage },


    { method: "GET", path: "/api/users", config: Users.find },
    { method: "GET", path: "/api/users/{id}", config: Users.findOne },
    { method: "POST", path: "/api/users", config: Users.create },
    { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
    { method: "PUT", path: "/api/users/{id}", config: Users.update },
    { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
    { method: "DELETE", path: "/api/admin/users/{id}", config: Users.deleteAdmin },
    { method: "DELETE", path: "/api/users", config: Users.deleteAll },


    { method: "GET", path: "/api/images", config: Images.findAll},
    { method: "GET", path: "/api/images/{id}", config: Images.findOne},
    { method: "POST", path: "/api/images/{id}", config: Images.AddImage},
    { method: "DELETE", path: "/api/images", config: Images.deleteAll},
    { method: "DELETE", path: "/api/images/{id}", config: Images.deleteOne},
]