"use client"

import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../utils/api'; // Adjust path as needed
import { useRouter } from 'next/navigation';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchMovieData = async () => {
      console.log('Searching for movies:', searchTerm);
      if (!searchTerm) {
        setMovies([]);
        return; // Prevent empty searches
      }

      try {
        const results = await fetchMovies({ title: searchTerm });
        if (!results) {
          setMovies(null); // No movies found
        } else {
          setMovies(results);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]); // Clear movies on error
      }
    };

    fetchMovieData();
  }, [searchTerm]);

  const handleChange = async (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      return; // Prevent empty searches
    }

    try {

      const results = await fetchMovies({ title: searchTerm });
      if (!results) {
        setMovies(null); // No movies found
      }
      else {
        setMovies(results); }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setMovies([]); // Clear movies on error
    }
  };

  const handleMovieClick = async (movieId) => {
    router.push(`/title/${movieId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <form onSubmit={handleSubmit} className="relative">
        <input
          placeholder="Search movies..."
          className="relative items-center justify-center input text-gray-900 shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none pr-10"
          name="search"
          type="search"
          value={searchTerm}
          onChange={handleChange}
        />

      </form>

      <div className="mt-4">
        {movies === null ? (
          <p className="mt-2 text-gray-600">No movies found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 mt-2">
            {movies.map((movie) => (
              <li key={movie.imdbID} className="py-2">
              <button onClick={() => handleMovieClick(movie.imdbID)} className='py-2'>
          
                <h3 className="text-lg font-semibold">{movie.Title}</h3>
                <p>Year: {movie.Year}</p>
                <p>IMDB ID: {movie.imdbID}</p>
              
              </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
