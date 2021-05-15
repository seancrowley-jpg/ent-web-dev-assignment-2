'use strict';

const Poi = require('../models/poi');
const Boom = require("@hapi/boom");

const  Pois = {
    find: {
        auth: false,
        handler: async function (request, h) {
            const pois = await Poi.find();
            return pois;
        },
    },

    findOne: {
        auth: false,
        handler: async function (request, h) {
            try {
                const poi = await Poi.findOne({ _id: request.params.id });
                if (!poi) {
                    return Boom.notFound("No POI with this ID");
                }
                return poi;
            } catch (err) {
                return Boom.notFound("No POI with this ID");
            }
        },
    },
};

module.exports = Pois;