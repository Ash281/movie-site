import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN_TMDB;

export async function fetchMovies(filters) {
  const { title } = filters;
  const response = await fetch(`${API_URL}&s=${title}`);
  const data = await response.json();
  return data.Search;
}

export async function fetchMovieDetails(id) {
  const response = await fetch(`${API_URL}&i=${id}&plot=full`);
  const data = await response.json();
  return data;
}

export async function fetchTrendingMovies() {
  const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/trending/all/day',
    params: { language: 'en-US' },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}` // Use your TMDb API key here
    }
  };

  try {
    const response = await axios.request(options);
    console.log('Trending movies:', response.data.results);
    return response.data.results.slice(0, 9); // Return only the first 10 trending movies
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return []; // Return an empty array in case of error
  }
}

export async function getIMDBId(id) {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${id}/external_ids`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  };

  try {
    const response = await axios.request(options);
    console.log('IMDB ID:', response.data.imdb_id);
    return response.data.imdb_id;
  } catch (error) {
    console.error('Error fetching IMDB ID:', error);
    return null; // Return null in case of error
  }
}