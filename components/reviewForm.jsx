import React from "react";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";
import dayjs from "dayjs";

const ReviewForm = ({movieId, onNewReview}) => {
    const { user } = useClerk();
    const clerkId = user?.id || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target);
        const review = e.target.review.value;
        const rating = e.target.rating.value;
        console.log(review, rating, movieId);
        try {
            const response = await axios.post('/api/submit-review', {
                userId: clerkId,
                movieId,
                review,
                rating,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const newReview = {
                name: user.fullName.split(' ')[0],
                review,
                rating,
                createdat: dayjs().format('MMMM D, YYYY'),
            };
            console.log(newReview);
            onNewReview(newReview);
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
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 text-white"
            placeholder="Write your review here..."
            />
            <label htmlFor="rating" className="sr-only">
            Rating
            </label>
            <select
                id="rating"
                name="rating"
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 text-white"
                defaultValue=""
                >
                <option value="" disabled>Select rating</option>
                {[...Array(10)].map((_, i) => {
                    const value = (i + 1) * 0.5;
                    return <option key={value} value={value}>{value}</option>;
                })}
                </select>
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