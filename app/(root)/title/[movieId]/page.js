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
    <div
      className="bg-repeat bg-cover text-white h-screen w-screen flex items-center flex-col justify-center"
      style={{
        backgroundImage: `url(${movie.Poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        <button
        onClick={() => window.history.back()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-20 left-10"
      >
        Back to search
      </button>
      <div className="bg-black bg-opacity-75 p-10 mx-10 rounded-md">
        <h1 className="text-4xl font-bold">{movie.Title}</h1>
        <p className="mt-2 text-lg">{movie.Plot}</p>
      </div>
    </div>
  );
};

export default MovieDetails;
