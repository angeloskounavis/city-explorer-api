'use strict';

require('dotenv').config();
const axios = require('axios');
let cache = require('./cache');


async function getWeather(request, response) {
  let { lat, lon } = request.query;
  const key = 'weather-' + lat + lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('cache found');
  } else {
    console.log('missed the cache');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseWeather(response.data));
    console.log(cache[key].data);
  }
  response.send(cache[key].data);

}
function parseWeather(weatherData) {
  try {
    const weatherForecasts = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherForecasts);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
    this.timestamp = Date.now();
  }
}

module.exports = getWeather;




// function handleWeather(request, response) {
//   let { searchQuery } = request.query;
//   const city = weather.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

//   try {
//     // http://localhost:3001/weather?city=Seattle
//     // let cityInput = request.query.city;
//     // let selectedCity = data.find(eachCityObj=> eachCityObj.city_name === cityInput);
//     // console.log(selectedCity);
//     const weatherArr = city.data.map(day => new Forecast(day));
//     response.status(200).send(weatherArr);
//     console.log(weatherArr);

//   } catch (error) {
//     // create a new instance of the Error object that lives in Express
//     errorHandler(error, response);
//   }
// }
