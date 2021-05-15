const Pois = require('./app/api/pois');

module.exports = [
    { method: 'GET', path: '/api/pois', config: Pois.find },
    { method: 'GET', path: '/api/pois/{id}', config: Pois.findOne },
]