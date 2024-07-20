"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMovieDetails } from "../../../../utils/api";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      const movieData = await fetchMovieDetails(movieId);
      setMovie(movieData);
    };

    getMovieDetails();
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${movie.Poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          WebkitFilter: 'blur(12px)',
          opacity: 0.6,
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 -z-10" />

      {/* Content */}
      <div className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto flex flex-col items-center p-6">
        <div className="relative z-10 flex flex-col items-center justify-center bg-black bg-opacity-75 p-8 rounded-lg max-w-4xl w-full mx-4">
          <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-80 h-auto mb-4"
          />
          <div className="text-center">
            <p className="mb-2">
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p className="mb-2">
              <strong>Director:</strong> {movie.Director}
            </p>
            <p className="mb-2">
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p className="mt-4">
              <strong>Plot:</strong> {movie.Plot}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
