"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useClerk } from "@clerk/nextjs";
import MovieCard from "@/components/movieCard";
import { fetchMovieDetails } from "@/utils/api";

const Library = () => {
  const { user } = useClerk();
  const clerkId = user?.id || null;
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (!clerkId) return; // Exit early if clerkId is not available

      console.log('Fetching liked movies for user:', clerkId);
      try {
        const response = await axios.get('/api/get-user-likes', {
          params: {
            userId: clerkId,
          },
        });
        for (let i = 0; i < response.data.likes.length; i++) {
          response.data.likes[i] = await fetchMovieDetails(response.data.likes[i].movieid);
        }
        setLikedMovies(response.data.likes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liked movies:', error);
      }
    };

    fetchLikedMovies();
  }, [clerkId]); // Add clerkId as a dependency

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Your Liked Movies</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <li className="text-center text-gray-500 col-span-full">Loading...</li>
        ) : likedMovies.length === 0 ? (
          <li className="text-center text-gray-500 col-span-full">No liked movies found</li>
        ) : (
          likedMovies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)
        )}
      </ul>
    </div>
  );
};

export default Library;
