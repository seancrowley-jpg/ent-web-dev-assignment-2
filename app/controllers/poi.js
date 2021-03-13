const Walk = require("../models/poi");
const User = require("../models/user");
const Image = require("../models/image");
const ImageStore = require("../utils/image-store");
const axios = require("axios");

async function getWeather(poi) {
  const apiKey = process.env.api_key;
  let weather = {};
  const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?lat=${poi.lat}&lon=${poi.lon}&appid=${apiKey}`;
  const response = await axios.get(weatherRequest);
  if (response.status == 200) {
    weather = response.data;
  }
  const report = {
    feelsLike: Math.round(weather.main.feels_like - 273.15),
    clouds: weather.weather[0].description,
    windSpeed: weather.wind.speed,
    windDirection: weather.wind.deg,
    visibility: weather.visibility / 1000,
    humidity: weather.main.humidity,
  };
  //console.log("report", report);
  return report;
}

const Poi = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add a Point of Interest" });
    },
  },

  report: {
    handler: async function (request, h) {
      const pois = await Walk.find().populate("user").lean();
      return h.view("report", {
        title: "View Points of Interest",
        poi: pois,
      });
    },
  },

  userReport: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const pois = await Walk.find({ user: user._id }).populate("user").lean();
      return h.view("user-report", {
        title: "My Points of Interest",
        poi: pois,
      });
    },
  },

  addPoi: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newWalk = new Walk({
        name: data.name,
        description: data.description,
        lat: data.lat,
        lon: data.lon,
        user: user._id,
        category: data.category,
        image: [],
      });
      await newWalk.save();
      console.log(newWalk);
      return h.redirect("/report");
    },
  },

  viewPoi: {
    handler: async function (request, h) {
      try {
        const poi = await Walk.findById({ _id: request.params._id }).populate("image").lean();
        const apiKey = process.env.api_key;
        console.log("api: ", apiKey);
        console.log("poi: ", poi);
        const weather = await getWeather(poi);
        console.log("Weather", weather);
        return h.view("poi", {
          title: "Viewing Point of Interest",
          poi: poi,
          weather: weather,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  viewUserPoi: {
    handler: async function (request, h) {
      const poi = await Walk.findById({ _id: request.params._id }).populate("image").lean();
      console.log("poi: ", poi);
      return h.view("user-poi", {
        title: "Viewing Your Point of Interest",
        poi: poi,
      });
    },
  },

  deletePoi: {
    handler: async function (request, h) {
      await Walk.findById({ _id: request.params._id }).remove();
      return h.redirect("/user-report");
    },
  },

  showUpdatePoi: {
    handler: async function (request, h) {
      const poi = await Walk.findById({ _id: request.params._id }).lean();
      return h.view("update-poi", {
        title: "Update Point of Interest",
        poi: poi,
      });
    },
  },

  updatePoi: {
    handler: async function (request, h) {
      const poiEdit = request.payload;
      const poi = await Walk.findById({ _id: request.params._id });
      poi.name = poiEdit.name;
      poi.description = poiEdit.description;
      poi.lat = poiEdit.lat;
      poi.lon = poiEdit.lon;
      await poi.save();
      return h.redirect("/user-report");
    },
  },

  addImage: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        const poi = await Walk.findById({ _id: request.params._id });
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
          return h.redirect("/user-report");
        }
        return h.view("report", {
          title: "error",
          error: "No file selected",
        });
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
    handler: async function (request, h) {
      try {
        const public_id = request.params.public_id;
        await ImageStore.deleteImage(public_id);
        await Image.find({ public_id: public_id }).remove();
        return h.redirect("/user-report");
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = Poi;
