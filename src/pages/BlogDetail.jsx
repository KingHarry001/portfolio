// src/components/blog/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  User, 
  Tag, 
  Loader,
  AlertCircle,
  Share2,
  Bookmark,
  MessageCircle,
  Home,
  ChevronLeft
} from "lucide-react";
import { blogAPI } from "../api/supabase";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  // Fetch post effect
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching post with slug:", slug);
        
        // Fetch the specific post
        const postData = await blogAPI.getBySlug(slug);
        console.log("Post data received:", postData);
        
        if (postData) {
          setPost(postData);
          
          // Fetch related posts (same category)
          const posts = await blogAPI.getAll();
          const related = posts
            .filter(p => p.id !== postData.id && p.category === postData.category)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Scroll listener effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleShare = () => {
    if (post && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else if (post) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error or post not found state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Fixed header with back button */}
          <div className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50 mb-8">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-slate-300 hover:text-white transition-colors group"
              >
                <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                Back to Blog
              </button>
            </div>
          </div>

          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">{error || "Post not found"}</h2>
            <Link 
              to="/" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mt-4"
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main render - all hooks must be called before this point
  return (
    <div className="min-h-screen bg-gradient-to-br py-[4.5rem] from-slate-900 via-slate-800 to-slate-900">
      {/* Sticky Navigation Header */}
      <div className={`fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50 z-50 transition-all duration-300 ${isSticky ? 'py-3' : 'py-4'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors group"
            >
              <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
              Back
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Article header */}
        <article className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8">
          {/* Category and meta info */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 rounded-full text-sm font-medium">
              {post.category || "Uncategorized"}
            </span>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author || "Harrison King"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.publish_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{calculateReadTime(post.content)}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-slate-300 mb-8 leading-relaxed border-l-4 border-cyan-500/50 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
              {post.excerpt}
            </div>
          )}

          {/* Featured image */}
          {post.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden border border-slate-700/50">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-invert max-w-none">
            {post.content?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-slate-300 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-slate-400" />
              <span className="text-slate-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                {post.category}
              </span>
              <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                {calculateReadTime(post.content)}
              </span>
              <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                {post.author || "Harrison King"}
              </span>
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 md:p-8 mb-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Enjoyed this article?</h3>
          <p className="text-slate-300 mb-6">
            Share it with your network or explore more content below.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Share2 size={18} />
              Share Article
            </button>
            <Link
              to="/blog"
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Bookmark size={18} />
              More Articles
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group hover:transform hover:-translate-y-1"
                >
                  <div className="mb-4">
                    <span className="px-2 py-1 bg-slate-700/50 text-cyan-300 text-xs rounded">
                      {relatedPost.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                    {relatedPost.excerpt || relatedPost.content?.substring(0, 100) + "..."}
                  </p>
                  <div className="flex items-center justify-between text-slate-400 text-sm">
                    <span>{calculateReadTime(relatedPost.content)}</span>
                    <span className="group-hover:text-cyan-400 transition-colors">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogDetail;