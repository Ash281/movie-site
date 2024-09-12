"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMovieDetails } from "../../../../utils/api";
import ReviewForm from "../../../../components/reviewForm";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";
import dayjs from "dayjs";
import { make } from "clerk";

const MovieDetails = () => {
  const { user } = useClerk();
  const clerkId = user?.id || null;
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const getValueOrNone = (value) => {
    return value ? value : None;
  };

  const makeQueryString = (movie) => {
    const description = getValueOrNone(movie.Plot);
    const genre = getValueOrNone(movie.Genre);
    const director = getValueOrNone(movie.Director);
    const actors = getValueOrNone(movie.Actors);
    const country = getValueOrNone(movie.Country);
    const title = getValueOrNone(movie.Title);

    const queryString = 'Title: ' + title + '.' +
    ' Description (important): ' + description + '.' +
    ' Cast: ' + actors + '.' +
    ' Director: ' + director + '.' +
    ' Country: ' + country + '.' +
    ' Listed in: ' + genre + '.';

    console.log("Query string:", queryString);
    return queryString;
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const movieData = await fetchMovieDetails(movieId);
      setMovie(movieData);
    };
    getMovieDetails();
  }, [movieId]);

  useEffect(() => {
    const getSimilarMovies = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/recommend", {
          query: makeQueryString(movie),
        });
        console.log("Similar movies:", response.data.recommended_movies);
        setSimilarMovies(response.data);
      } catch (error) {
        console.error("Error getting similar movies:", error);
      }
    };
    getSimilarMovies();
  }, [movie]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get("/api/get-reviews", {
          params: {
            movieId,
            userId: clerkId,
          },
        });
        setReviews(response.data.all_reviews);
        setRating(response.data.average_rating);
        console.log("All reviews:", response.data.all_reviews);
      } catch (error) {
        console.error("Error getting reviews:", error);
      }
    };
    getReviews();
  }, [clerkId, movieId]);

  const handleNewReview = async (newReview) => {
    setUserReview(newReview);
    setReviews((prevReviews) => [newReview, ...prevReviews.filter(review => review.userid !== clerkId)]);
    setRating((rating * reviews.length + newReview.rating) / (reviews.length + 1));
  };

  const handleEditReview = async (review, rating) => {
    try {
      const response = await axios.post("/api/edit-review", {
        userId: clerkId,
        movieId,
        review,
        rating,
      });
      console.log("Review updated successfully:", response.data.message);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  }

  const handleDeleteReview = async () => {
    try {
      const response = await axios.post("/api/delete-review", {
        userId: clerkId,
        movieId,
      });
      setReviews((prevReviews) => prevReviews.filter((review) => review.userid !== clerkId));
      setRating((rating * reviews.length - userReview.rating) / (reviews.length - 1));
      setUserReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  useEffect(() => {
    const getUserReview = async () => {
      try {
        const response = await axios.get("/api/get-user-review", {
          params: {
            movieId,
            userId: clerkId,
          },
        });
        console.log("userid:", clerkId, "movieId:", movieId);
        console.log("User review:", response.data[0]);
        if (response.data.message) {
          setUserReview(null);
        } else {
          setUserReview(response.data[0]);
        }
      } catch (error) {
        console.error("Error getting user review:", error);
      }
    };
    getUserReview();
  }, [clerkId, movieId]);

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
          {clerkId ? (
            userReview === null ? (
              <ReviewForm movieId={movie.imdbID} onNewReview={handleNewReview} />
            ) : null
          ) : (
            <div className="mt-8 w-full max-w-2xl text-center text-white text-bold text-xl">
              <p>Please log in to write a review</p>
            </div>
          )}
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl mb-4">Average Rating: {Number(rating)}</h2>
            <h2 className="text-2xl mb-4">Reviews</h2>
            {userReview !== null && (
              <div className="mb-4 bg-yellow-200 p-4 rounded shadow text-black">
                <h3 className="font-bold text-black">{(userReview.name).split(' ')[0]}</h3>
                <p>{userReview.review}</p>
                <p className="mt-2">Rating: {Number(userReview.rating)}</p>
                <p>{dayjs(userReview.createdat).format('MMMM D, YYYY')}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-700 text-white py-2 px-4 rounded-lg"
                    onClick={() => handleEditReview(userReview.review, userReview.rating)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-700 text-white py-2 px-4 rounded-lg"
                    onClick={handleDeleteReview}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {reviews.length > 0 ? (
              reviews.filter(review => review.userid !== clerkId).map((review, index) => (
                <div key={index} className="mb-4 bg-white p-4 rounded shadow text-black">
                  <h3 className="font-bold text-black">{(review.name).split(' ')[0]}</h3>
                  <p>{review.review}</p>
                  <p className="mt-2">Rating: {Number(review.rating)}</p>
                  <p>{dayjs(review.createdat).format('MMMM D, YYYY')}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to write one!</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
