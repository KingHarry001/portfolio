import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react'; // Import Clerk auth
import { reviewsAPI } from '../../api/supabase';
import { Trash2, Search, Filter, Star, User, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast'; // Import toast

export default function AdminReviewsPanel() {
  const { userId, isLoaded } = useAuth(); // Get Clerk userId
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoaded) {
      fetchAllReviews();
    }
  }, [isLoaded]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      // Use the reviewsAPI.getAll() function we created
      const data = await reviewsAPI.getAll();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId, userName, appName) => {
    if (!window.confirm(`Delete review by ${userName} for ${appName}?`)) return;
    
    try {
      // Check if user is authenticated
      if (!userId) {
        toast.error('You must be logged in to delete reviews');
        return;
      }

      // Pass the actual userId from Clerk
      await reviewsAPI.delete(reviewId, userId);
      toast.success('Review deleted successfully');
      
      // Refresh the list
      fetchAllReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to delete review';
      if (error.message.includes('User not found')) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to delete this review';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Review not found or already deleted';
      }
      
      toast.error(errorMessage);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.users?.name?.toLowerCase().includes(searchLower) ||
      review.apps?.name?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower) ||
      review.users?.email?.toLowerCase().includes(searchLower)
    );
  });

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-600 mt-2">Manage user reviews and ratings for apps</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                <div className="text-gray-500">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reviews.length > 0 
                    ? Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length * 10) / 10
                    : '0.0'
                  }
                </div>
                <div className="text-gray-500">Avg Rating</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {reviews.length === 0 ? 'No Reviews Yet' : 'No Matching Reviews'}
              </h3>
              <p className="text-gray-500">
                {reviews.length === 0 
                  ? 'Users haven\'t submitted any reviews yet.' 
                  : `No reviews match "${searchTerm}". Try a different search term.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">App</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      {/* App Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <img 
                              src={review.apps?.icon_url || '/placeholder-app.png'} 
                              alt={review.apps?.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-app.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate max-w-xs">
                              {review.apps?.name || 'Unknown App'}
                            </div>
                            {review.apps?.slug && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {review.apps.slug}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* User Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {review.users?.image_url ? (
                              <img 
                                src={review.users.image_url} 
                                alt={review.users.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.users?.name || 'User')}&background=random`;
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate max-w-xs">
                              {review.users?.name || 'Anonymous User'}
                            </div>
                            {review.users?.email && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {review.users.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < (review.rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-gray-900 ml-1">
                            {review.rating || 0}.0
                          </span>
                        </div>
                      </td>

                      {/* Review Column */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-900 line-clamp-2">
                            {review.comment || 'No comment provided.'}
                          </p>
                          {review.comment && review.comment.length > 100 && (
                            <button 
                              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                              onClick={() => {
                                // You could add a modal to show full review
                                alert(review.comment);
                              }}
                            >
                              Read more
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(review.created_at)}
                        </div>
                        {review.updated_at !== review.created_at && (
                          <div className="text-xs text-gray-500 mt-1">
                            (edited)
                          </div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteReview(
                              review.id, 
                              review.users?.name || 'this user', 
                              review.apps?.name || 'this app'
                            )}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats - Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
            <div className="text-sm text-gray-500">Total Reviews</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {reviews.length > 0 
                ? Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length * 10) / 10
                : '0.0'
              }
            </div>
            <div className="text-sm text-gray-500">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}