"use client";

import React from "react";
import { useParams } from "next/navigation";
import { fetchMovieDetails } from "../../../../utils/api";

const MovieDetails = async () => {
    const { movieId } = useParams();
    const movie = await fetchMovieDetails(movieId);
    
    return (
        <div>
        <h1>{movie.Title}</h1>
        <p>{movie.Plot}</p>
        </div>
    );
    };

export default MovieDetails;