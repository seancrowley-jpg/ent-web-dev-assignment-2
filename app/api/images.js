"use strict"

const Image = require("../models/image");
const Poi = require("../models/poi")
const Boom = require("@hapi/boom");
const ImageStore = require("../utils/image-store");


const Images = {
    findAll: {
        auth: false,
        handler: async function (request, h) {
            const images = await Image.find();
            return images;
        },
    },

    deleteAll: {
        auth: false,
        handler: async function (request, h) {
            await Image.remove({});
            return {success: true};
        },
    },

    findOne: {
        auth: false,
        handler: async function (request, h) {
            try {
                const image = await Image.findOne({_id: request.params.id});
                if (!image) {
                    return Boom.notFound("No Image with this id");
                }
                return image;
            } catch (err) {
                return Boom.notFound("No Image with this id");
            }
        },
    },

    AddImage: {
        auth: false,
        handler: async function (request, h) {
            const file = request.payload.imagefile;
            const poi = await Poi.findById({_id: request.params._id});
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
                if (newImage) {
                    return h.response(poi).code(201);
                }
                return Boom.badImplementation("Error creating new Image");
            }
        },
    },


    deleteOne: {
        auth: false,
        handler: async function (request, h) {
            const response = await Image.deleteOne({_id: request.params.id});
            if (response.deletedCount == 1) {
                return { success: true};
            }
            return Boom.notFound("ID not found")
        }
    }
};

module.exports = Images;