import React from "react";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";

const ReviewForm = (movieId) => {
    const { user } = useClerk();
    const clerkId = user?.id || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target);
        const review = e.target.review.value;
        const rating = e.target.rating.value;
        console.log(review, rating);
        try {
            const response = await axios.post('/api/submit-review', {
                userId: clerkId,
                movieId: movieId.movieId,
                review,
                rating,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Review submitted successfully:', response.data.message);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center pt-5">
        <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
        <form className="flex flex-col items-center justify-center w-full max-w-lg" onSubmit={handleSubmit}>
            <label htmlFor="review" className="sr-only">
            Review
            </label>
            <textarea
            id="review"
            name="review"
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 text-black"
            placeholder="Write your review here..."
            />
            <label htmlFor="rating" className="sr-only">
            Rating
            </label>
            <input
            type="number"
            id="rating"
            name="rating"
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 text-black"
            placeholder="Rating (1-5)"
            />
            <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
            Submit
            </button>
        </form>
        </div>
    );
    }

    export default ReviewForm;