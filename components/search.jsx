'use client';

import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../utils/api';
import MovieCard from './movieCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      console.log('Searching for movies:', searchTerm);
      if (!searchTerm) {
        setMovies([]);
        return;
      }

      try {
        const results = await fetchMovies({ title: searchTerm });
        if (!results) {
          setMovies(null);
        } else {
          setMovies(results);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

    fetchMovieData();
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      return;
    }

    fetchMovieData();
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
          <ul className="divide-y divide-gray-200 mt-2 text-left">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
