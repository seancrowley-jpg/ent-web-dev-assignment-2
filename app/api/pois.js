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

    create: {
        auth: false,
        handler: async function (request, h) {
            const newPoi = new Poi(request.payload);
            const poi = await newPoi.save();
            if (poi) {
                return h.response(poi).code(201);
            }
            return Boom.badImplementation("Error creating new POI");
        },
    },

    deleteAll: {
        auth: false,
        handler: async function (request, h) {
            await Poi.remove({});
            return { success: true};
        },
    },

    deleteOne: {
        auth: false,
        handler: async function (request, h) {
            const poi = await Poi.remove({_id: request.params.id});
            if (poi) {
                return { success: true};
            }
            return Boom.notFound("ID not found")
        }
    }
};

module.exports = Pois;