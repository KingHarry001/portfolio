import { useState, useEffect } from 'react';
import { reviewsAPI } from '../../api/supabase';
import { Trash2, Search, Star, User, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getAll();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(`Are you sure you want to delete this review?`)) return;
    
    try {
      // ✅ USE THE ADMIN BYPASS KEY (Matches your AppsTable logic)
      await reviewsAPI.delete(reviewId, "admin-bypass");
      
      toast.success('Review deleted successfully');
      // Optimistic update (remove from UI immediately)
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.users?.name?.toLowerCase().includes(searchLower) ||
      review.apps?.name?.toLowerCase().includes(searchLower) ||
      review.review_text?.toLowerCase().includes(searchLower) // Changed from .comment to .review_text based on your DB schema
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-cyan-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Reviews</p>
            <h2 className="text-3xl font-bold text-white">{reviews.length}</h2>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <MessageSquare size={24} />
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Average Rating</p>
            <h2 className="text-3xl font-bold text-white">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
                : '0.0'
              }
            </h2>
          </div>
          <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
            <Star size={24} fill="currentColor" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search user, app, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Found</h3>
            <p className="text-gray-400">
              {searchTerm ? `No matches for "${searchTerm}"` : "Waiting for user feedback..."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">App</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">Review</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-white/10">
                          {review.users?.image_url ? (
                            <img src={review.users.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">{review.users?.name || 'Anonymous'}</span>
                      </div>
                    </td>

                    {/* App */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-cyan-400 border border-white/5">
                        {review.apps?.name || 'Deleted App'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < (review.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700"} 
                          />
                        ))}
                      </div>
                    </td>

                    {/* Content */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-2" title={review.review_text}>
                        "{review.review_text || review.comment || 'No text'}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}