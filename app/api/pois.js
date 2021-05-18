'use strict';

const Poi = require('../models/poi');
const Boom = require("@hapi/boom");
const utils = require("./utils");

const Pois = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const pois = await Poi.find();
            return pois;
        },
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
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
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const userId = utils.getUserIdFromRequest(request);
            let poi = new Poi(request.payload);
            poi.user = userId;
            poi = await poi.save();
            if (poi) {
                return h.response(poi).code(201);
            }
            return Boom.badImplementation("Error creating new POI");
        },
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            await Poi.remove({});
            return { success: true};
        },
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const response = await Poi.deleteOne({_id: request.params.id});
            if (response.deletedCount == 1) {
                return { success: true};
            }
            return Boom.notFound("ID not found")
        }
    }
};

module.exports = Pois;