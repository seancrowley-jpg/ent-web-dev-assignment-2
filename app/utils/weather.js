"use strict";
const axios = require("axios");
const weather = {
  async getWeather(poi) {
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
  },
};

module.exports = weather;
