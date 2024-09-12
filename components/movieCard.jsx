import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';

const MovieCard = ({ movie }) => {
  const router = useRouter();
  const { user } = useClerk();
  const clerkId = user?.id || null;
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLikeStatus = async () => {
      try {
        const response = await axios.get('/api/check-user-likes', {
          params: {
            movieId: movie.imdbID,
            userId: clerkId,
          },
        });
        setLiked(response.data.liked);
        setLoading(false);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    getLikeStatus();
  }, [clerkId, movie.imdbID]);

  const handleMovieClick = () => {
    router.push(`/title/${movie.imdbID}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post('/api/user-likes-movie', {
        movieId: movie.imdbID,
        userId: clerkId,
        like: !liked,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  return (
    <li className="py-2 border-2 p-4 text-white bg-new-gray hover:bg-gray-600 rounded-md">
      <button
        onClick={handleMovieClick}
        className="flex items-center justify-between w-full transform transition duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div className="text-left w-full">
          <h3 className="text-lg font-semibold">{movie.Title}</h3>
          <p>Year: {movie.Year}</p>
          <div className="mt-2 flex items-center">
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-2xl transition duration-300 ${liked ? 'text-red-500' : 'text-gray-500'} hover:scale-125`}
                onClick={handleLike}
              />
            )}
          </div>
        </div>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-20 h-30 ml-4 transform transition duration-300 hover:scale-110"
        />
      </button>
    </li>
  );
};

export default MovieCard;
