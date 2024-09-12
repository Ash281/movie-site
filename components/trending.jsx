"use client";

import React, { useEffect, useState } from "react";
import { fetchTrendingMovies, getIMDBId, fetchMovieDetails } from "@/utils/api";
import MovieCard from "./movieCard";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(""); // State for background image
  const [currentIndex, setCurrentIndex] = useState(0); // Index for current movie

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Fetch the trending movies
        const results = await fetchTrendingMovies();

        // Get IMDb IDs for each movie and filter out those with null IMDb IDs
        const imdbIdPromises = results.map(async (movie) => {
          const imdbId = await getIMDBId(movie.id);
          return { ...movie, imdbId };
        });

        // Resolve all IMDb ID promises
        const moviesWithImdbIds = await Promise.all(imdbIdPromises);

        // Filter out movies with null IMDb IDs
        const validMovies = moviesWithImdbIds.filter(movie => movie.imdbId);

        // Fetch full movie details for each valid IMDb ID
        const movieDetailPromises = validMovies.map(async (movie) => {
          const movieData = await fetchMovieDetails(movie.imdbId);
          return { ...movie, ...movieData }; // Merge details with original movie object
        });

        // Resolve all movie detail promises
        const movieDetailsData = await Promise.all(movieDetailPromises);

        // Set the movie details and trending movies states
        console.log('Movie details:', movieDetailsData);
        setMovieDetails(movieDetailsData);
        setTrending(results);

        // Initialize background image
        if (movieDetailsData.length > 0) {
          setBackgroundImage(movieDetailsData[0].Poster);
        }
      } catch (error) {
        console.error('Error fetching trending movies or movie details:', error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    // Set up interval to change background image every 5 seconds (5000ms)
    const interval = setInterval(() => {
      if (movieDetails.length > 0) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movieDetails.length;
          setBackgroundImage(movieDetails[nextIndex].Poster);
          return nextIndex;
        });
      }
    }, 5000); // Change every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [movieDetails]);

  return (
    <div className="inset-0">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 z-0" // Ensure background is behind everything
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          WebkitFilter: 'blur(12px)',
          opacity: 0.9,
          transition: 'background-image 1s ease-in-out',
          minHeight: '100vh',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content */}
      <div className="relative z-20 text-center py-2">
        <h1 className="text-4xl font-bold mb-4">Trending</h1>
        <p className="text-lg text-gray-600">Check out the latest trending movies!</p>
      </div>

      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
        {movieDetails.length > 0 ? (
          movieDetails.map((movie) => (
            movie.imdbId ? (
              <MovieCard key={movie.imdbId} movie={{ ...movie, imdbID: movie.imdbId }} />
            ) : (
              <div key={`no-id-${movie.id}`}>No IMDb ID found for {movie.title}</div>
            )
          ))
        ) : (
          <p>Loading trending movies...</p>
        )}
      </div>
    </div>
  );
};

export default Trending;
