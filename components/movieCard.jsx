import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const router = useRouter();
  const { user } = useClerk();
  const clerkId = user?.id || null;

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
        } catch (error) {
            console.error('Error checking like status:', error);
        }
        };
        getLikeStatus();
    }, [clerkId, movie.imdbID]);

  const [liked, setLiked] = useState(false);

  const handleMovieClick = () => {
    router.push(`/title/${movie.imdbID}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    console.log('Liking movie:', movie.imdbID);
    console.log('User ID:', clerkId);

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

      console.log('Movie liked successfully:', response.data.message);
    } catch (error) {
      console.error('Error liking movie:', error);
    }
  };

  return (
    <li className="py-2">
      <button
        onClick={handleMovieClick}
        className="py-2 flex items-center justify-between w-full"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold">{movie.Title}</h3>
          <p>Year: {movie.Year}</p>
          {liked ?
          <FontAwesomeIcon
            icon={faHeart}
            className={`text-red-500 mr-2 ${
              movie.liked ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={handleLike}
          /> :
          <FontAwesomeIcon
            icon={faHeart}
            className={`text-grey-500 mr-2 ${
              movie.liked ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={handleLike}
          />
            }
        </div>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-20 h-30 ml-4"
        />
      </button>
    </li>
  );
};

export default MovieCard;
