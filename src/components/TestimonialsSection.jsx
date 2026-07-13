import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import FeedbackForm from './FeedbackForm';
import { FiStar, FiThumbsUp, FiThumbsDown, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const TestimonialsSection = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await API.get('/reviews');
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchReviews();
    }
  }, [refreshKey, fetchReviews]);

  const handleFeedbackSubmitted = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const toggleLike = async (id) => {
    try {
      const { data } = await API.post(`/reviews/${id}/like`);
      setReviews((prev) => prev.map((r) => (r._id === id ? data : r)));
    } catch (err) {
      showErrorToast('Please login to like');
    }
  };

  const toggleDislike = async (id) => {
    try {
      const { data } = await API.post(`/reviews/${id}/dislike`);
      setReviews((prev) => prev.map((r) => (r._id === id ? data : r)));
    } catch (err) {
      showErrorToast('Please login to dislike');
    }
  };

  const deleteReview = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      showSuccessToast('Review deleted');
    } catch (err) {
      showErrorToast('Failed to delete review');
    }
  };

  const isLiked = (review) => user && review.likes?.some((id) => id === user._id || id._id === user._id);
  const isDisliked = (review) => user && review.dislikes?.some((id) => id === user._id || id._id === user._id);
  const isOwner = (review) => user && (review.user?._id === user._id || review.user === user._id);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <div className="flex items-center space-x-3 mb-8">
        <FiMessageSquare className="text-blue-400" size={28} />
        <h2 className="section-title">What Our Customers Say</h2>
      </div>

      <div className="mb-8">
        <FeedbackForm onSubmitted={handleFeedbackSubmitted} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-800 rounded w-full mb-2" />
              <div className="h-3 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <FiMessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="card p-6 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} size={16} className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-4">"{review.text}"</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{review.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium truncate">{review.name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleLike(review._id)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isLiked(review) ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <FiThumbsUp size={13} />
                    <span>{review.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => toggleDislike(review._id)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isDisliked(review) ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <FiThumbsDown size={13} />
                    <span>{review.dislikes?.length || 0}</span>
                  </button>
                  {isOwner(review) && (
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
