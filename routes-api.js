const Pois = require('./app/api/pois');

module.exports = [
    { method: 'GET', path: '/api/pois', config: Pois.find },
    { method: 'GET', path: '/api/pois/{id}', config: Pois.findOne },
    { method: "POST", path: "/api/pois", config: Pois.create },
    { method: "DELETE", path: "/api/pois/{id}", config: Pois.deleteOne },
    { method: "DELETE", path: "/api/pois", config: Pois.deleteAll },
]