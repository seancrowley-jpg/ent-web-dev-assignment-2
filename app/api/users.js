"use strict"

const User = require("../models/user");
const Poi = require("../models/poi");
const Boom = require("@hapi/boom");
const utils = require("./utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let sanitizeHtml = require("sanitize-html");

const Users = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const users = await User.find();
            return users;
        },
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const user = await User.findOne({ _id: request.params.id });
                if (!user) {
                    return Boom.notFound("No User with this id");
                }
                return user;
            } catch (err) {
                return Boom.notFound("No User with this id");
            }
        },
    },

    create: {
        auth: false,
        handler: async function (request, h) {
            const newUser = new User(request.payload);
            const hash = await bcrypt.hash(newUser.password, saltRounds);
            newUser.password = hash
            sanitizeHtml(newUser)
            const user = await newUser.save();
            if (user) {
                return h.response(user).code(201);
            }
            return Boom.badImplementation("error creating user");
        },
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            await User.deleteMany({});
            return { success: true };
        },
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const user = await User.findById(utils.getUserIdFromRequest(request));
            await Poi.find({ user: user._id }).remove();
            await user.remove();
            if (user) {
                return { success: true };
            }
            return Boom.notFound("id not found");
        },
    },

    deleteAdmin: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const user = await User.findOne({ _id: request.params.id });
            await Poi.find({ user: user._id }).remove();
            await user.remove();
            if (user) {
                return { success: true };
            }
            return Boom.notFound("id not found");
        },
    },

    authenticate: {
        auth: false,
        handler: async function (request, h) {
            try {
                const user = await User.findOne({ email: request.payload.email });
                const match = await user.comparePassword(request.payload.password);
                if (!user) {
                    return Boom.unauthorized("User not found");
                } else if (!match) {
                    return Boom.unauthorized("Invalid password");
                } else {
                    const token = utils.createToken(user);
                    return h.response({ success: true, token: token }).code(201);
                }
            } catch (err) {
                return Boom.notFound("internal db failure");
            }
        },
    },

    update: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const userEdit = request.payload;
            const hash = await bcrypt.hash(userEdit.password, saltRounds);
            const user = await User.findById(utils.getUserIdFromRequest(request));
            user.firstName = userEdit.firstName;
            user.lastName = userEdit.lastName;
            user.email = userEdit.email;
            user.password = hash;
            sanitizeHtml(user);
            await user.save();
            if (user) {
                return { success: true };
            }
            return Boom.notFound("id not found");
        },
    },
};

module.exports = Users;