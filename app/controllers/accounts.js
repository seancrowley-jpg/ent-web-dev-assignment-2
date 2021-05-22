"use strict";

const User = require("../models/user");
const Poi = require("../models/poi");
const Image = require("../models/image");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Accounts = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Point of Interest Web App" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Sign up" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const hash = await bcrypt.hash(payload.password, saltRounds);
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    },
  },

  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("login", {
            title: "Sign in error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        await user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },

  showAdmin: {
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await User.find().lean();
        const pois = await Poi.find().populate("user").lean();
        const userCount = await User.find().count();
        const poiCount = await Poi.find().count();
        const imageCount = await Image.find().count();
        console.log("User Count:", userCount);
        console.log("Poi Count: ", pois);
        return h.view("admin-dashboard", {
          title: "Admin Dashboard",
          poi: pois,
          user: users,
          userCount: userCount,
          poiCount: poiCount,
          imageCount: imageCount,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  showSettings: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", { title: "Settings", user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },

  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const id = request.auth.credentials.id;
      const hash = await bcrypt.hash(userEdit.password, saltRounds);
      const user = await User.findById(id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      user.password = hash;
      await user.save();
      return h.redirect("/settings");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        await Poi.find({ user: user._id }).remove();
        await user.remove();
        return h.redirect("/");
      } catch (err) {
        return h.view("settings", { errors: [{ message: err.message }] });
      }
    },
  },

  adminDeleteUser: {
    auth: false,
    handler: async function (request, h) {
      try {
        const id = request.params._id;
        const user = await User.findById(id);
        await Poi.find({ user: user._id }).remove();
        await user.remove();
        return h.redirect("/admin-dashboard");
      } catch (err) {
        return h.view("admin-dashboard", { errors: [{ message: err.message }] });
      }
    },
  },

  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};

module.exports = Accounts;
