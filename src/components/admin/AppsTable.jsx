import { useState } from "react";
import {
  Plus,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  Smartphone,
  MessageSquare,
  Download,
  User,
  Quote,
  X,
  Loader2,
  Eye
} from "lucide-react";
import { reviewsAPI, appsAPI } from "../../api/supabase"; // Import appsAPI
import toast from "react-hot-toast";

const AppsTable = ({ apps, onAddApp, onEditApp, onDeleteApp }) => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedAppForReviews, setSelectedAppForReviews] = useState(null);
  
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const formatDownloads = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  // ✅ NEW: Handle Download Click & Increment Count
  const handleDownloadClick = async (e, app) => {
    e.stopPropagation(); // Stop card click
    
    if (!app.download_url) return;

    // 1. Open the link immediately (better UX)
    window.open(app.download_url, "_blank");

    // 2. Tell Server to increment count
    try {
      await appsAPI.incrementDownloads(app.id);
      console.log(`Incremented downloads for ${app.name}`);
      // Note: The UI won't update until refresh, which is fine for stats
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
  };

  const openReviewsModal = async (app) => {
    setSelectedAppForReviews(app);
    setShowReviewsModal(true);
    setLoadingReviews(true);
    setReviews([]);

    try {
      const data = await reviewsAPI.getByAppId(app.id);
      setReviews(data || []);
    } catch (error) {
      console.error(`Error loading reviews:`, error);
      toast.error(`Failed to load reviews`);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewsAPI.delete(reviewId, "admin-bypass");
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Apps Management
          </h3>
          <p className="text-gray-400">Manage your app store applications.</p>
        </div>
        
        <button
          onClick={onAddApp}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add App
        </button>
      </div>

      {/* Grid */}
      {apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Smartphone size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No apps added yet</h3>
          <button onClick={onAddApp} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add First App
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="p-5 flex flex-col flex-1">
                
                {/* Header Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img src={app.icon_url || "https://via.placeholder.com/64"} alt={app.name} className="w-16 h-16 rounded-2xl bg-gray-800 object-cover shadow-lg" />
                    {app.featured && (
                      <div className="absolute -top-2 -right-2 p-1 bg-yellow-500/20 rounded-full border border-yellow-500/50 shadow-sm backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-bold text-white truncate">{app.name}</h4>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); openReviewsModal(app); }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/5 hover:border-cyan-500/30"
                      >
                        <MessageSquare size={14} />
                        <span>Reviews</span>
                      </button>
                    </div>
                    <p className="text-xs font-medium text-cyan-400/80 mb-2">{app.category}</p>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 bg-black/20 p-1.5 rounded-lg w-fit">
                      <span className="flex items-center gap-1.5 px-1">
                        <Download size={12} className="text-blue-400" /> 
                        <span className="text-gray-300">{formatDownloads(app.downloads)}</span>
                      </span>
                      <div className="w-px h-3 bg-white/10" />
                      <span className="flex items-center gap-1.5 px-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" /> 
                        <span className="text-gray-300">{app.rating ? Number(app.rating).toFixed(1) : "0.0"}</span>
                        <span className="text-gray-600">({app.rating_count || 0})</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5em]">{app.short_description}</p>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  {app.download_url && (
                    <button
                      onClick={(e) => handleDownloadClick(e, app)}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title="Download APK"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  
                  {app.website_url && (
                    <a
                      href={app.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}

                  <div className="flex-1" />

                  <button onClick={(e) => { e.stopPropagation(); onEditApp(app); }} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteApp(app.id); }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && selectedAppForReviews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">Reviews for {selectedAppForReviews.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{selectedAppForReviews.rating || "0.0"}</span>
                  <span>•</span>
                  <span>{reviews.length} reviews</span>
                </div>
              </div>
              <button onClick={() => setShowReviewsModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {loadingReviews ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-cyan-500" />
                  <p>Loading feedback...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No reviews found for this app yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all group relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                            {review.users?.image_url ? <img src={review.users.image_url} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={14} />}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-white">{review.users?.name || "Anonymous"}</div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={8} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700"} />
                                ))}
                              </div>
                              <span>•</span>
                              <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                      </div>
                      <div className="pl-11"><p className="text-sm text-gray-300 leading-relaxed">{review.review_text}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppsTable;