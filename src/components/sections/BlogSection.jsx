import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Mail,
  CheckCircle,
  AlertCircle,
  Tag,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Users
} from "lucide-react";
import { blogAPI } from "../../api/supabase";

// --- Types ---
const PostTypes = {
  SECURITY: 'Security',
  DEVELOPMENT: 'Development',
  CRYPTO: 'Crypto',
  DESIGN: 'Design',
  TECHNOLOGY: 'Technology',
  TUTORIAL: 'Tutorial',
  NEWS: 'News',
};

const StatusTypes = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// --- Utility Components ---

const CategoryBadge = React.memo(({ category, size = "default" }) => {
  const colorMap = useMemo(() => ({
    [PostTypes.SECURITY]: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    [PostTypes.DEVELOPMENT]: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    [PostTypes.CRYPTO]: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
    [PostTypes.DESIGN]: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    [PostTypes.TECHNOLOGY]: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    [PostTypes.TUTORIAL]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
    [PostTypes.NEWS]: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
    default: "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700/80",
  }), []);

  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-xs",
    large: "px-4 py-2 text-sm",
  };

  const style = colorMap[category] || colorMap.default;
  const sizeClass = sizeClasses[size];

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium border transition-all duration-300 ${style} ${sizeClass}`}
      aria-label={`Category: ${category || "General"}`}
    >
      <Tag size={size === "small" ? 10 : 12} />
      {category || "General"}
    </span>
  );
});

CategoryBadge.displayName = 'CategoryBadge';

const BlogSkeleton = React.memo(() => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-8"
    role="status"
    aria-label="Loading blog posts"
  >
    {/* Featured Skeleton */}
    <div className="grid md:grid-cols-2 gap-8">
      <div className="h-64 md:h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl animate-pulse" />
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-800/50 rounded animate-pulse" />
        <div className="h-8 w-full bg-slate-800/50 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse" />
      </div>
    </div>
    
    {/* Grid Skeletons */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="h-64 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  </motion.div>
));

BlogSkeleton.displayName = 'BlogSkeleton';

// --- Main Component ---

const BlogSection = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(StatusTypes.IDLE);
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Fetch blog data
  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      const [posts, featured] = await Promise.allSettled([
        blogAPI.getAll(),
        blogAPI.getFeatured(),
      ]);

      if (posts.status === 'fulfilled' && posts.value?.length > 0) {
        setBlogPosts(posts.value);
        setFeaturedPost(featured.status === 'fulfilled' && featured.value 
          ? featured.value 
          : posts.value[0]
        );
      } else {
        setBlogPosts([]);
        setFeaturedPost(null);
      }

      if (posts.status === 'rejected') {
        throw new Error("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching blog data:", err);
      setFetchError("Failed to load insights. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setSubscriptionStatus(StatusTypes.ERROR);
      setTimeout(() => setSubscriptionStatus(StatusTypes.IDLE), 3000);
      return;
    }

    setSubscriptionStatus(StatusTypes.LOADING);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubscriptionStatus(StatusTypes.SUCCESS);
      setEmail("");
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus(StatusTypes.IDLE);
      }, 5000);
    } catch (err) {
      setSubscriptionStatus(StatusTypes.ERROR);
      setTimeout(() => setSubscriptionStatus(StatusTypes.IDLE), 3000);
    }
  }, [email]);

  const calculateReadTime = useCallback((content) => {
    const words = content?.split(/\s+/).length || 0;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }, []);

  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString("en-US", {
        month: "short", 
        day: "numeric", 
        year: "numeric"
      });
    } catch {
      return "Invalid date";
    }
  }, []);

  // Filter and memoize posts
  const filteredPosts = useMemo(() => {
    if (!blogPosts.length) return [];
    
    let filtered = [...blogPosts];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => 
        post.category === selectedCategory
      );
    }
    
    return filtered;
  }, [blogPosts, searchQuery, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(blogPosts.map(p => p.category).filter(Boolean))];
    return cats;
  }, [blogPosts]);

  // Blog statistics
  const stats = useMemo(() => ({
    totalPosts: blogPosts.length,
    totalCategories: categories.length - 1, // exclude "all"
    featuredPosts: blogPosts.filter(p => p.featured).length,
    averageReadTime: Math.round(
      blogPosts.reduce((acc, post) => {
        const words = post.content?.split(/\s+/).length || 0;
        return acc + Math.ceil(words / 200);
      }, 0) / Math.max(1, blogPosts.length)
    ),
  }), [blogPosts, categories]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featuredVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Handle post click with analytics
  const handlePostClick = useCallback((post) => {
    // TODO: Add analytics tracking
    console.log('Viewing post:', post.title);
    navigate(`/blog/${post.slug}`);
  }, [navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, post) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePostClick(post);
    }
  }, [handlePostClick]);

  return (
    <section 
      id="blog" 
      className="relative py-24 bg-[#050505] overflow-hidden"
      aria-labelledby="blog-heading"
    >
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6"
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>Knowledge Base</span>
            <Sparkles size={14} aria-hidden="true" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            id="blog-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Insights</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Exploring the frontiers of Cybersecurity, Web3 Development, and System Architecture. 
            Dive deep into technical explorations and industry insights.
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{stats.totalPosts}</div>
            <div className="text-sm text-slate-400">Articles</div>
          </div>
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalCategories}</div>
            <div className="text-sm text-slate-400">Categories</div>
          </div>
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.averageReadTime}</div>
            <div className="text-sm text-slate-400">Avg Read Time</div>
          </div>
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{stats.featuredPosts}</div>
            <div className="text-sm text-slate-400">Featured</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 pl-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                aria-label="Search blog articles"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-cyan-500 text-black"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <BlogSkeleton />
        ) : fetchError ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-red-500/20"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" aria-hidden="true" />
            <p className="text-red-300 text-lg mb-6">{fetchError}</p>
            <button 
              onClick={fetchBlogData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </motion.div>
        ) : blogPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-slate-700/50"
          >
            <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-6" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-white mb-4">No Articles Yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Blog articles will be published soon. Check back later for insights on technology, development, and security.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Featured Post */}
              {featuredPost && (
                <motion.div variants={featuredVariants} className="mb-20">
                  <div 
                    onClick={() => handlePostClick(featuredPost)}
                    onKeyDown={(e) => handleKeyDown(e, featuredPost)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Read featured article: ${featuredPost.title}`}
                    className="group relative grid md:grid-cols-2 gap-8 bg-gradient-to-br from-slate-900/60 to-black/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 cursor-pointer hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    {/* Image/Gradient Placeholder */}
                    <div className="relative h-64 md:h-full min-h-[300px] w-full rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-black" />
                      <div className="absolute inset-0 bg-grid-white/[0.02]" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6">
                        <CategoryBadge category={featuredPost.category} size="large" />
                      </div>
                      <div className="absolute top-6 right-6">
                        <Sparkles className="text-cyan-400" size={24} />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-2">
                      <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-6">
                        <span className="flex items-center gap-2">
                          <Calendar size={16} aria-hidden="true" />
                          <time dateTime={featuredPost.publish_date}>
                            {formatDate(featuredPost.publish_date)}
                          </time>
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={16} aria-hidden="true" />
                          {calculateReadTime(featuredPost.content)}
                        </span>
                        <span className="flex items-center gap-2 text-cyan-400">
                          <TrendingUp size={16} aria-hidden="true" />
                          Featured
                        </span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors duration-300">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-slate-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                        {featuredPost.excerpt || featuredPost.content?.substring(0, 180) + "..."}
                      </p>

                      <div className="flex items-center text-cyan-400 font-bold group/link mt-auto">
                        <span>Read Full Article</span>
                        <ArrowRight className="ml-3 w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid Posts */}
              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredPosts
                      .filter(p => p.id !== featuredPost?.id)
                      .slice(0, 6)
                      .map((post, index) => (
                      <motion.article 
                        key={post.id}
                        variants={itemVariants}
                        custom={index}
                        onClick={() => handlePostClick(post)}
                        onKeyDown={(e) => handleKeyDown(e, post)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Read article: ${post.title}`}
                        className="group relative bg-gradient-to-br from-slate-900/40 to-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden"
                      >
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-transparent group-hover:from-cyan-500/5 group-hover:via-purple-500/5 transition-all duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-5">
                            <CategoryBadge category={post.category} />
                            <span className="text-xs text-slate-500">
                              {formatDate(post.publish_date)}
                            </span>
                          </div>
                          
                          <h4 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h4>
                          
                          <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                            {post.excerpt || post.content?.substring(0, 120)}...
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Clock size={12} aria-hidden="true" />
                              {calculateReadTime(post.content)}
                            </span>
                            <ArrowRight 
                              size={16} 
                              className="text-slate-300 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" 
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                  {/* View All Link */}
                  {filteredPosts.length > 6 && (
                    <motion.div 
                      variants={itemVariants}
                      className="text-center mb-16"
                    >
                      <Link
                        to="/blog"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                      >
                        View All Articles ({filteredPosts.length})
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-16 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-slate-700/50"
                >
                  <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">No Matching Articles</h3>
                  <p className="text-slate-400 mb-6">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Newsletter Section */}
              <motion.div 
                variants={itemVariants}
                className="relative bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-black/60 border border-cyan-500/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <div className="relative z-10 max-w-2xl mx-auto">
                  <Mail className="w-14 h-14 text-cyan-400 mx-auto mb-8" aria-hidden="true" />
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
                    Join the Developer Community
                  </h3>
                  <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                    Get exclusive access to deep-dive technical articles, security alerts, 
                    and cutting-edge Web3 insights delivered weekly.
                  </p>

                  <form 
                    onSubmit={handleNewsletterSubmit} 
                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                  >
                    <div className="relative flex-1">
                      <input 
                        type="email" 
                        placeholder="Your professional email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={subscriptionStatus === StatusTypes.LOADING || subscriptionStatus === StatusTypes.SUCCESS}
                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Email address for newsletter subscription"
                        aria-describedby="subscription-status"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={subscriptionStatus === StatusTypes.LOADING || subscriptionStatus === StatusTypes.SUCCESS}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-800 text-black font-bold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
                    >
                      <AnimatePresence mode="wait">
                        {subscriptionStatus === StatusTypes.LOADING ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"
                          />
                        ) : subscriptionStatus === StatusTypes.SUCCESS ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle size={20} />
                            Subscribed!
                          </motion.div>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Subscribe Now
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </form>
                  
                  <p id="subscription-status" className="text-sm text-slate-500 mt-4">
                    {subscriptionStatus === StatusTypes.ERROR 
                      ? "Please enter a valid email address"
                      : "No spam, unsubscribe anytime"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(BlogSection);