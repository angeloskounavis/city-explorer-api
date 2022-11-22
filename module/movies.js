
const axios = require('axios');
let cache = require('./cache.js');

module.exports = getMovies;

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

class Movie {
  constructor(movie) {
    this.title = movie.title,
    this.overview = movie.overview,
    this.average_votes = movie.vote_average,
    this.total_votes = movie.vote_count,
    this.image_url = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
    this.popularity = movie.popularity,
    this.released_on = movie.release_date;
  }
}
