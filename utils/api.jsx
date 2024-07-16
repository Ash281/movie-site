const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export async function fetchMovies(filters) {
  const { title } = filters;
  const response = await fetch(`${API_URL}&s=${title}`);
  const data = await response.json();
    
  return data.Search;
}

export async function fetchMovieDetails(id) {
  const response = await fetch(`${API_URL}&i=${id}&plot=full`);
  const data = await response.json()
  
  return data;
}
