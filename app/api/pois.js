'use strict';

const Poi = require('../models/poi');
const Boom = require("@hapi/boom");
const utils = require("./utils");
const Weather = require("../utils/weather");
const Image = require("../models/image")
const ImageStore = require("../utils/image-store");
const fs = require("fs");

const Pois = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const pois = await Poi.find().populate("user");
            return pois;
        },
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const poi = await Poi.findById({ _id: request.params.id }).populate("image").populate("user");
                if (!poi) {
                    return Boom.notFound("No POI with this ID");
                }
                return poi;
            } catch (err) {
                return Boom.notFound("No POI with this ID");
            }
        },
    },

    findUserPOIs: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const pois = await Poi.find({user : utils.getUserIdFromRequest(request)}).populate("user");
                if (!pois) {
                    return Boom.notFound("No POIs with this ID");
                }
                return pois;
            } catch (err) {
                return Boom.notFound("No POIs with this ID");
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

    editPoi: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const poiEdit = request.payload;
            const poi = await Poi.findById({ _id: request.params.id }).populate("image").populate("user");
            poi.name = poiEdit.name;
            poi.description = poiEdit.description;
            poi.lat = poiEdit.lat;
            poi.lon = poiEdit.lon;
            poi.category = poiEdit.category;
            await poi.save();
            if (poi) {
                return { success: true };
            }
            return Boom.notFound("Id not found");
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
    },

    getWeather: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const poi = await Poi.findById({ _id: request.params.id });
            const report = await Weather.getWeather(poi);
            return report;
        }
    },

    addImage: {
        auth: false,
        handler: async function (request, h) {
            try {
                const file = request.payload;
                console.log(request);
                console.log(file);
                const poi = await Poi.findById({_id: request.params.id});
                if (Object.keys(file).length > 0) {
                    const result = await ImageStore.uploadImage(file);
                    const newImage = new Image({
                        url: result.url,
                        public_id: result.public_id,
                    });
                    await newImage.save();
                    console.log(poi);
                    await poi.image.push(newImage._id);
                    await poi.save();
                }
            } catch (err) {
                console.log(err);
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
    },

    deleteImage: {
        auth: false,
        handler: async function (request, h) {
            let public_id = request.params.public_id
            await ImageStore.deleteImage(public_id);
            const response = await Image.deleteOne({public_id: request.params.public_id});
            if (response.deletedCount == 1) {
                return { success: true};
            }
            return Boom.notFound("ID not found")
        }
    }
};

module.exports = Pois;