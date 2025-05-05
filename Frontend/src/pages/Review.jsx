import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../api/axios';

function Review({ book, reviews, setReviews, currentUser, isAuthenticated, navigate, hasPurchased }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!comment.trim() || rating < 1 || isSubmittingReview) return;
    setIsSubmittingReview(true);
    try {
      const newReview = {
        bookId: book.id,
        rating,
        comment,
        memberName: currentUser?.name || 'User',
      };
      const response = await api.post('/api/Reviews', newReview);
      setReviews([...reviews, { ...newReview, id: response.data.id, userId: currentUser?.id || 'unknown' }]);
      setComment('');
      setRating(0);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review.');
      console.error('Review error:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.delete(`/api/Reviews/${reviewId}`);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review.');
      console.error('Delete review error:', err.response?.status, err.response?.data || err.message);
    }
  };

  const renderStars = (rating, interactive = false, setRatingFn = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
              interactive ? 'cursor-pointer hover:text-yellow-500' : ''
            }`}
            onClick={interactive ? () => setRatingFn(star) : null}
            disabled={!interactive}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Average Rating</h3>
        <div className="flex items-center gap-4">
          {renderStars(book.rating || 0)}
          <span className="text-gray-600 text-sm">
            {(book.rating || 0).toFixed(1)} out of 5
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {reviews.length} {reviews.length === 1 ? 'rating' : 'ratings'}
        </p>
      </div>

      {isAuthenticated ? (
        hasPurchased ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Thoughts</h3>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Your Rating</p>
              {renderStars(rating, true, setRating)}
            </div>
            <textarea
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              aria-label="Write your review"
            />
            <button
              className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleAddComment}
              disabled={isSubmittingReview || !comment.trim() || rating < 1}
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            You must purchase this book to leave a review.
          </p>
        )
      ) : (
        <p className="text-sm text-gray-500 italic">Please log in to leave a review.</p>
      )}


      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-900">{review.memberName}</p>
                  {review.userId === currentUser?.id && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Review;