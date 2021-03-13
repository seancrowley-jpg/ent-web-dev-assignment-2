const axios = require("axios");

async function getWeather(poi) {
  const weatherRequest = `api.openweathermap.org/data/2.5/weather?lat=${poi.lat}&lon=${poi.lon}&appid=${apiKey}`;
  let weather = {};
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
  console.log(report);
}

module.exports = getWeather();
