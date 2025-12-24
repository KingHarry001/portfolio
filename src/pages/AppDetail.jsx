import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { appsAPI, reviewsAPI, usersAPI } from "../api/supabase";
import {
  ArrowLeft,
  Download,
  Star,
  Smartphone,
  Globe,
  Layers,
  Image as ImageIcon,
  Grid3x3,
  List,
  Check,
  X,
  Share2,
  Edit,
  Trash2,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function AppDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  // State declarations
  const [app, setApp] = useState(null);
  const [relatedApps, setRelatedApps] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [screenshotViewMode, setScreenshotViewMode] = useState("grid");
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const editingReview = !!userReview;

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "features", label: "Features", icon: Check },
    { id: "screenshots", label: "Screenshots", icon: ImageIcon },
    { id: "requirements", label: "Requirements", icon: Smartphone },
  ];

  // Helper functions
  const formatDownloads = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  const handleDownload = async () => {
    try {
      if (app?.download_url) {
        window.open(app.download_url, "_blank");
      }
    } catch (err) {
      console.error("Error downloading:", err);
      toast.error("Failed to download");
    }
  };

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch app data
  useEffect(() => {
    fetchApp();
  }, [slug]);

  const fetchApp = async () => {
    try {
      setLoading(true);
      const data = await appsAPI.getBySlug(slug);
      if (!data) {
        throw new Error("App not found");
      }
      setApp(data);
      fetchRelatedApps(data.category, data.id);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching app:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedApps = async (category, currentAppId) => {
    try {
      const allApps = await appsAPI.getAll({ published: true });
      const related = allApps
        .filter((a) => a.category === category && a.id !== currentAppId)
        .slice(0, 5);
      setRelatedApps(related);
    } catch (error) {
      console.error("Error fetching related apps", error);
    }
  };

  useEffect(() => {
    if (app?.id) {
      fetchReviews();
      fetchReviewStats();
      checkIfAdmin();
    }
  }, [app?.id, user]);

  useEffect(() => {
    if (isSignedIn && app?.id) {
      fetchUserReview();
    }
  }, [isSignedIn, app?.id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewsAPI.getByAppId(app.id);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const stats = await reviewsAPI.getStats(app.id);
      setReviewStats({
        averageRating: parseFloat(stats.average_rating) || 0,
        totalReviews: stats.total_reviews || 0,
        ratingDistribution: {
          5: stats.rating_5 || 0,
          4: stats.rating_4 || 0,
          3: stats.rating_3 || 0,
          2: stats.rating_2 || 0,
          1: stats.rating_1 || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const fetchUserReview = async () => {
    try {
      if (user) {
        const review = await reviewsAPI.getUserReview(app.id, user.id);
        setUserReview(review);
        if (review) {
          setReviewForm({
            rating: review.rating,
            reviewText: review.review_text,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const checkIfAdmin = async () => {
    try {
      if (user) {
        const adminStatus = await usersAPI.isAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  // --- UPDATED SYNC FUNCTION ---
  // Now propagates errors up so handleSubmitReview knows if it failed
  const syncUserToDatabase = async () => {
    if (!user) return;
    try {
      const clerkMetadata = user.publicMetadata || {};
      let role = 'user';
      if (clerkMetadata.role === 'admin' || clerkMetadata.isAdmin === true) {
        role = 'admin';
      }
      await usersAPI.createOrUpdate({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        image_url: user.imageUrl,
        clerk_metadata: clerkMetadata,
        role: role
      });
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error; // Re-throw so we can catch it in submit
    }
  };

  // --- UPDATED SUBMIT FUNCTION ---
  // Better error logging
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return;

    setSubmitting(true);
    try {
      // 1. Sync User First
      await syncUserToDatabase();

      const reviewData = {
        app_id: app.id,
        rating: reviewForm.rating,
        review_text: reviewForm.reviewText.trim(),
      };

      // 2. Submit or Update Review
      if (userReview) {
        await reviewsAPI.update(userReview.id, reviewData, user.id);
        toast.success("Review updated!");
      } else {
        await reviewsAPI.create(reviewData, user.id);
        toast.success("Review submitted!");
      }

      // 3. Refresh Data
      await fetchReviews();
      await fetchReviewStats();
      await fetchUserReview();

      setShowReviewForm(false);
      setReviewForm({ rating: 5, reviewText: "" });
    } catch (error) {
      // LOG THE ACTUAL ERROR MESSAGE
      console.error("Error submitting review (Details):", error);
      
      // If it's a Supabase error object, it might have a message property
      const msg = error.message || error.error_description || "Unknown error";
      toast.error(`Failed: ${msg}`);
      
      // Check for RLS policy error specifically
      if (error.code === '42501') {
          console.warn("Hint: This looks like a Row Level Security (RLS) policy error in Supabase.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      // We start a sync in background on load, but don't block render
      syncUserToDatabase().catch(err => console.error("Background sync failed", err));
    }
  }, [isSignedIn, user]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewsAPI.delete(reviewId, user.id);
      await fetchReviews();
      await fetchReviewStats();
      if (userReview?.id === reviewId) {
        setUserReview(null);
        setReviewForm({ rating: 5, reviewText: "" });
      }
      toast.success("Review deleted");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleEditReview = (review) => {
    setUserReview(review);
    setReviewForm({
      rating: review.rating,
      reviewText: review.review_text,
    });
    setShowReviewForm(true);
    document.getElementById("review-form")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    if (userReview) {
      setReviewForm({
        rating: userReview.rating,
        reviewText: userReview.review_text,
      });
    } else {
      setReviewForm({ rating: 5, reviewText: "" });
    }
  };

  const renderStarRating = (rating, iconClass = "w-4 h-4") => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} ${
            star <= rating
              ? "text-orange-400 fill-orange-400"
              : "text-muted/30 fill-muted/30"
          }`}
        />
      ))}
    </div>
  );

  // Early returns
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
         <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-chart-1/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-chart-1 border-t-transparent rounded-full animate-spin"></div>
         </div>
         <p className="mt-4 text-muted-foreground animate-pulse">Loading app details...</p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "The app you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/apps")}
            className="px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-chart-1/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] right-0 w-[50%] h-[50%] bg-chart-1/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Floating Navbar / Back Button */}
      {/* Updated to top-16 to avoid overlapping header */}
      <div className="fixed top-16 left-0 right-0 z-50 px-4 md:px-6 py-2 pointer-events-none">
        <div className="max-w-7xl mx-auto">
            <button
            onClick={() => navigate("/apps")}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-sm font-medium hover:bg-background/90 transition-all shadow-lg"
            >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-36 pb-16 relative z-10">
        
        {/* HERO SECTION */}
        <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start text-center md:text-left">
                {/* Icon */}
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-chart-1/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                        src={app.icon_url}
                        alt={app.name}
                        className="relative w-28 h-28 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] object-cover shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{app.name}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground">{app.short_description}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                        <div className="px-3 py-1 rounded-full bg-card border border-border flex items-center gap-2">
                             <span className="font-semibold text-foreground">{app.category}</span>
                        </div>
                        {app.developer_name && (
                            <span className="text-muted-foreground flex items-center gap-1">
                                by <span className="text-foreground font-medium">{app.developer_name}</span>
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                         <button
                            onClick={handleDownload}
                            disabled={!app.download_url}
                            className={`px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 ${
                                app.download_url
                                ? "bg-chart-1 text-white hover:bg-chart-1/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                            }`}
                        >
                            <Download className="w-5 h-5" />
                            {app.download_url ? "Get App" : "Coming Soon"}
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied!");
                            }}
                            className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
                <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Rating</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xl md:text-2xl font-bold text-foreground">{reviewStats.averageRating.toFixed(1)}</span>
                        <Star className="w-4 h-4 md:w-5 md:h-5 fill-chart-4 text-chart-4" />
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">{reviewStats.totalReviews} reviews</div>
                </div>
                 <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Downloads</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xl md:text-2xl font-bold text-foreground">{formatDownloads(app.downloads)}</span>
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Total installs</div>
                </div>
                 <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Size</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xl md:text-2xl font-bold text-foreground">{app.size || "N/A"}</span>
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Lightweight</div>
                </div>
                 <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Updated</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg md:text-xl font-bold text-foreground">
                            {app.last_updated ? new Date(app.last_updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : "N/A"}
                        </span>
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Version {app.version || "1.0"}</div>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Content (Details) */}
            <div className="w-full lg:w-2/3 space-y-8">
                
                {/* Navigation Tabs */}
                <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto no-scrollbar shadow-lg">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                    isActive 
                                    ? "bg-foreground text-background shadow-md" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 min-h-[300px]">
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h3 className="text-xl font-bold mb-4">About this app</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base md:text-lg">
                                    {app.long_description || app.short_description}
                                </p>
                            </div>
                            {app.website_url && (
                                <a
                                    href={app.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-chart-1 font-medium hover:underline"
                                >
                                    <Globe className="w-4 h-4" />
                                    Visit Official Website
                                </a>
                            )}
                        </div>
                    )}

                    {activeTab === "features" && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold mb-6">Key Features</h3>
                             {app.features && app.features.length > 0 ? (
                                <div className="grid gap-4">
                                    {app.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-card/50 rounded-2xl border border-white/5">
                                            <div className="p-2 rounded-full bg-chart-1/10 text-chart-1 shrink-0">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="text-foreground/80 pt-1">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <div className="text-center py-12 text-muted-foreground">No features listed</div>
                             )}
                        </div>
                    )}

                    {activeTab === "screenshots" && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Gallery</h3>
                                <div className="flex bg-muted/50 rounded-lg p-1">
                                    <button onClick={() => setScreenshotViewMode("grid")} className={`p-1.5 rounded-md transition ${screenshotViewMode === 'grid' ? 'bg-background shadow' : 'text-muted-foreground'}`}>
                                        <Grid3x3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setScreenshotViewMode("list")} className={`p-1.5 rounded-md transition ${screenshotViewMode === 'list' ? 'bg-background shadow' : 'text-muted-foreground'}`}>
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {app.screenshots && app.screenshots.length > 0 ? (
                                screenshotViewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {app.screenshots.map((shot, i) => (
                                            <div 
                                                key={i} 
                                                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border border-white/5"
                                                onClick={() => setSelectedScreenshot(shot)}
                                            >
                                                <img src={shot} alt="Screenshot" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
                                                        <ImageIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                         {app.screenshots.map((shot, i) => (
                                            <div key={i} className="flex gap-4 p-4 bg-card/50 rounded-2xl border border-white/5 cursor-pointer hover:bg-card/70 transition" onClick={() => setSelectedScreenshot(shot)}>
                                                <img src={shot} alt="Screenshot" className="w-24 h-24 object-cover rounded-xl" />
                                                <div className="flex items-center text-chart-1 font-medium text-sm">View Full Screen</div>
                                            </div>
                                         ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">No screenshots available</div>
                            )}
                        </div>
                    )}

                    {activeTab === "requirements" && (
                        <div className="animate-fade-in space-y-6">
                            <h3 className="text-xl font-bold mb-4">System Requirements</h3>
                            {app.min_android_version && (
                                <div className="p-6 bg-card/50 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Android OS</div>
                                        <div className="text-muted-foreground">Version {app.min_android_version} or higher</div>
                                    </div>
                                </div>
                            )}
                            {app.requirements?.length > 0 && (
                                <div className="p-6 bg-card/50 rounded-2xl border border-white/5">
                                    <h4 className="font-semibold mb-4">Additional Notes</h4>
                                    <ul className="space-y-3">
                                        {app.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-2 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* REVIEWS SECTION */}
                <div id="reviews-section" className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                    {/* Review Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                             <h3 className="text-2xl font-bold">Ratings & Reviews</h3>
                        </div>
                        {!userReview && isSignedIn ? (
                            <button
                            onClick={() => {
                                setShowReviewForm(true);
                                document.getElementById("review-form")?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-6 py-2.5 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition shadow-lg w-full md:w-auto"
                            >
                            Write a Review
                            </button>
                        ) : !isSignedIn ? (
                            <button className="px-6 py-2.5 bg-muted text-foreground rounded-xl font-medium w-full md:w-auto">
                                Sign in to Review
                            </button>
                        ) : (
                             <button
                            onClick={() => {
                                setShowReviewForm(true);
                                document.getElementById("review-form")?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-6 py-2.5 bg-muted text-foreground rounded-xl font-medium border border-border hover:bg-muted/80 w-full md:w-auto"
                            >
                            Edit Your Review
                            </button>
                        )}
                    </div>

                    {/* Review Stats */}
                     <div className="grid md:grid-cols-3 gap-8 items-center mb-12 p-6 bg-card/40 rounded-2xl border border-white/5">
                        <div className="text-center md:border-r border-border/50">
                            <div className="text-6xl font-bold text-foreground">{reviewStats.averageRating.toFixed(1)}</div>
                            <div className="flex justify-center my-2">
                                {renderStarRating(Math.round(reviewStats.averageRating), "w-5 h-5")}
                            </div>
                            <p className="text-sm text-muted-foreground">{reviewStats.totalReviews} ratings</p>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = reviewStats.ratingDistribution[rating] || 0;
                                const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                                return (
                                    <div key={rating} className="flex items-center gap-4 text-sm">
                                        <span className="font-medium w-3">{rating}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-chart-1 rounded-full" style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                     </div>

                     {/* Review Form */}
                     {showReviewForm && (
                         <div id="review-form" className="mb-12 animate-fade-in p-6 bg-background/50 border border-chart-1/30 rounded-2xl shadow-xl">
                            <h4 className="text-lg font-bold mb-6">{editingReview ? "Update Review" : "Write a Review"}</h4>
                             <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(r => (
                                            <button key={r} type="button" onClick={() => setReviewForm({...reviewForm, rating: r})} className="focus:outline-none transition-transform hover:scale-110">
                                                <Star className={`w-8 h-8 ${r <= reviewForm.rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Review</label>
                                    <textarea
                                        value={reviewForm.reviewText}
                                        onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                                        className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-chart-1 outline-none min-h-[120px]"
                                        placeholder="Tell us what you think..."
                                        minLength={10}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={handleCancelReview} className="px-6 py-2 rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
                                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-chart-1 text-white rounded-lg text-sm font-medium hover:bg-chart-1/90 disabled:opacity-50">
                                        {submitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                             </form>
                         </div>
                     )}

                     {/* Reviews List */}
                     <div className="space-y-6">
                         {loadingReviews ? (
                             <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-chart-1 border-t-transparent rounded-full animate-spin" /></div>
                        ) : reviews.length === 0 ? (
                             <div className="text-center py-12 text-muted-foreground">No reviews yet.</div>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="p-6 bg-card/40 rounded-2xl border border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold overflow-hidden">
                                                {review.users?.image_url ? (
                                                    <img src={review.users.image_url} alt="User" className="w-full h-full object-cover" />
                                                ) : (
                                                    (review.users?.name?.[0] || "U")
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{review.users?.name || "User"}</div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 self-end sm:self-auto">
                                            {(user?.id === review.user_id) && (
                                                <button onClick={() => handleEditReview(review)} className="p-2 text-muted-foreground hover:text-chart-1 transition"><Edit className="w-4 h-4" /></button>
                                            )}
                                            {(user?.id === review.user_id || isAdmin) && (
                                                <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        {renderStarRating(review.rating, "w-4 h-4")}
                                    </div>
                                    <p className="text-foreground/90 leading-relaxed text-sm">
                                        {review.review_text}
                                    </p>
                                </div>
                            ))
                        )}
                     </div>
                </div>

            </div>

            {/* Right Sidebar - Fully Functional "More Apps" */}
            <div className="w-full lg:w-1/3 space-y-6">
                 <div className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:sticky lg:top-24">
                    <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                        <Grid3x3 className="w-5 h-5 text-chart-1" />
                        Related Apps
                    </h3>
                    
                    {relatedApps.length > 0 ? (
                        <div className="space-y-4">
                            {relatedApps.map((relatedApp) => (
                                <div 
                                    key={relatedApp.id}
                                    onClick={() => navigate(`/apps/${relatedApp.slug}`)}
                                    className="group flex items-center gap-4 p-3 rounded-2xl bg-card/40 border border-white/5 hover:bg-card/70 hover:border-chart-1/30 transition-all cursor-pointer"
                                >
                                    <img 
                                        src={relatedApp.icon_url} 
                                        alt={relatedApp.name} 
                                        className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate group-hover:text-chart-1 transition-colors">{relatedApp.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                            <span>{relatedApp.rating}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-chart-1 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
                            <p className="text-sm">No related apps found.</p>
                        </div>
                    )}

                    <button 
                        onClick={() => navigate('/apps')}
                        className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5"
                    >
                        View All Apps
                    </button>
                 </div>
            </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedScreenshot && (
        <div 
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedScreenshot(null)}
        >
            <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
                <X className="w-6 h-6" />
            </button>
            <img 
                src={selectedScreenshot} 
                alt="Full View" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}