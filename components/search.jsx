'use client';

import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../utils/api';
import MovieCard from './movieCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!searchTerm) {
        setMovies([]);
        return;
      }

      try {
        const results = await fetchMovies({ title: searchTerm });
        setMovies(results || []);
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

  return (
    <div className="relative flex items-center w-4/5">
      <input
        placeholder="Search movies..."
        className="w-full input text-white shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl transition-all focus:border-2 outline-none pr-10"
        name="search"
        type="search"
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-10">
          {movies.length === 0 ? (
            <p className="p-4 text-gray-600">No movies found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
