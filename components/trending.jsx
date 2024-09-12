"use client";

import React, { useEffect, useState } from "react";
import { fetchTrendingMovies, getIMDBId, fetchMovieDetails } from "@/utils/api";
import MovieCard from "./movieCard";

const Trending = () => {
    const [trending, setTrending] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);

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
            } catch (error) {
                console.error('Error fetching trending movies or movie details:', error);
            }
        };

        fetchTrending();
    }, []);

    return (
        <div>
            <div className="text-center py-6">
                <h1 className="text-4xl font-bold mb-4">Trending</h1>
                <p className="text-lg text-gray-600">Check out the latest trending movies!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {movieDetails.length > 0 ? (
                    movieDetails.map((movie) => (
                        // Ensure the key prop is unique and defined
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
