import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { FiStar, FiSend } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const FeedbackForm = ({ onSubmitted }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post('/reviews', { text: text.trim(), rating });
      setText('');
      setRating(5);
      showSuccessToast('Thank you for your feedback!');
      if (onSubmitted) onSubmitted(data);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-8 text-center">
        <p className="text-gray-400 mb-3">Share your experience with us!</p>
        <Link to="/login" className="btn-primary inline-block text-sm">Login to leave feedback</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
      <h3 className="text-lg font-bold text-white mb-2">Share Your Experience</h3>
      <p className="text-gray-400 text-sm mb-4">Your feedback helps us improve!</p>

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors"
          >
            <FiStar
              size={24}
              className={`${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} transition-colors`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us what you think about our products and service..."
        rows={3}
        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm resize-none mb-3"
        maxLength={500}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{text.length}/500</span>
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={14} />
          <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
