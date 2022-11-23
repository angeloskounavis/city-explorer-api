'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./module/weather');
const movies = require('./module/movies');


// This is just how express works
const app = express();

// We must tell express to use cors
app.use(cors());

// define the PORT and validate that our .env is working
const PORT = process.env.PORT || 3001;

app.get('/weather', weather);
// app.use('*', (request, response) => response.status(404).send('No page found'));

app.get('/movies', handleMovies);


function handleMovies(request, response) {
  const location = request.query.city;
  movies(location)
    .then(moviesList => response.send(moviesList))
    .catch((error) => {
      console.error(error);
      response.status(500).send('something went wrong');
    });
}

// function handleWeather(request, response) {
//   let { lat, lon } = request.query;
//   console.log('I am in weather', lat, lon);
//   weather(lat, lon)
//     .then(weatherSummary => response.send(weatherSummary))
//     .catch((error) => {
//       console.error(error);
//       response.status(500).send('something went wrong');
//     });
// }

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
