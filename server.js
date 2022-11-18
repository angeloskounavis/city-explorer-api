'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// REQUIRE
// in our servers, we have to use 'require' instead of 'import'
// Here we will list the requirments for a server
// const express = require('express');
let weather = require('./data/weather.json');
let cache = require('./cache.js');


// we need to bring in our .env file, so we'll use this after we have installed
// `npm i dotenv`

// we must include CORS if we want to share resources over the web

// USE
// once we have required something, we have to use it
// Here is where we will assign the required file a variable
// React does this in one step with 'import' - express takes 2 steps: require and use
// This is just how express works
const app = express();

// We must tell express to use cors
app.use(cors());

// define the PORT and validate that our .env is working
const PORT = process.env.PORT || 3001;

// const MOVIES_API_KEY = process.env.MOVIES_API_KEY;

// If we see our server running on 3002, that means theere's a problem with our .env file or how we are importing it.

// I am create a route API for movies

app.get('/movies', async (req, res, next) => {
  try {
    let city = req.query.city;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${city}`;
    let movieResponse = await axios.get(url);
    console.log(movieResponse.data.results);
    let movieArray = movieResponse.data.results;
    let moviesToSend = movieArray.map(movie => new Movie(movie));
    res.send(moviesToSend);

  } catch (error) {
    next(error);

  }


});




// ROUTES
// this is where we will write handlers for our endpoints

// create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and callback function
// app.get('/', (request, response) => {
//   response.send('Hello, from our server');
// });

// app.get('/sayHello', (request, response) => {
//   console.log(request.query.name);
//   let lastName = request.query.lastName;
//   response.send(`Hi ${request.query.name} ${lastName}`);
// });

app.get('/weather', handleWeather);
app.use('*', (request, response) => response.status(404).send('No page found'));

function getMovies(location) {
  const key = 'movies-' + location;
  const url = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIES_API_KEY}&langeuage=en-US&page=1&query=${location}`;

  //https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=<<api_key>>&language=en-US


  if (!cache[key]) {
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(data => parseMoviesData(data.data));

  }
  return cache[key].data;
}

function parseMoviesData(data) {
  try {
    const movies = data.results.map(movie => {
      return new Movie(movie);
    });
    return Promise.resolve(movies);
  } catch (e) {
    return Promise.reject(e);
  }
}






function handleWeather(request, response) {
  let { searchQuery } = request.query;
  const city = weather.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

  try {
    // http://localhost:3001/weather?city=Seattle
    // let cityInput = request.query.city;
    // let selectedCity = data.find(eachCityObj=> eachCityObj.city_name === cityInput);
    // console.log(selectedCity);
    const weatherArr = city.data.map(day => new Forecast(day));
    response.status(200).send(weatherArr);
    console.log(weatherArr);

  } catch (error) {
    // create a new instance of the Error object that lives in Express
    errorHandler(error, response);
  }
  getMovies();
}

function Forecast(day) {
  this.day = day.valid_date;
  this.description = day.weather.description;
}


function Movie(movie) {
  this.title = movie.title,
  this.overview = movie.overview,
  this.average_votes = movie.vote_average,
  this.total_votes = movie.vote_count,
  this.image_url = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
  this.popularity = movie.popularity,
  this.released_on = movie.release_date;

}

// '*' wild card
// this will run for any route not defined above
// app.get('*', (request, response) => {
//   response.send('That route does not exist');
// });

// ERRORS
// handle any errors
function errorHandler(error, response) {
  response.status(500).send(error.message);
}

// CLASSES
// class Forecast {
//   constructor(day) {
//     this.date = day.valid_date;
//     this.description =day.weather.description;
//   }
// }


// LISTEN
// start the server

// listen is express method, it takes in a port value and a callback function
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
