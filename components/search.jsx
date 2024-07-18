'use client'

import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../utils/api';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useClerk } from '@clerk/nextjs';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const { user } = useClerk();
  const clerkId = user.id;

  const router = useRouter();

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

  const handleMovieClick = (movieId) => {
    router.push(`/title/${movieId}`);
  };

  const handleLike = async (movieId) => {
    console.log('Liking movie:', movieId);
    console.log('User ID:', clerkId); // Assuming clerkId holds userId

    try {
        const response = await axios.post('/api/user-likes-movie', {
            movieId,
            userId: clerkId, // Assuming clerkId holds userId
            like: true,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Movie liked successfully:', response.data.message); // Assuming response structure
        // Handle success scenario if needed
    } catch (error) {
        console.error('Error liking movie:', error);
        // Handle error scenario
    }
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
              <li key={movie.imdbID} className="py-2">
                <button
                  onClick={() => handleMovieClick(movie.imdbID)}
                  className="py-2 flex items-center justify-between w-full"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{movie.Title}</h3>
                    <p>Year: {movie.Year}</p>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`text-red-500 mr-2 ${
                        movie.liked ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      onClick={() => handleLike(movie.imdbID)}
                    />
                  </div>
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-20 h-30 ml-4"
                  />
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

