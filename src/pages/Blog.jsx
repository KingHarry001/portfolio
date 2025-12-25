import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Tag, BookOpen } from "lucide-react";
import { blogAPI } from "../api/supabase";

const BlogCard = ({ post, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group relative bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={post.image_url || "https://images.unsplash.com/photo-1499750310159-57751c6e9f4d?w=800&q=80"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
          <span className="px-3 py-1 text-xs font-bold text-white bg-chart-1/80 backdrop-blur-md rounded-full uppercase tracking-wider">
            {post.category || "Article"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publish_date || post.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.read_time || "5 min read"}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-chart-1 transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center text-sm font-semibold text-chart-1 gap-2 mt-auto group-hover:gap-3 transition-all">
          Read Article <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = posts;

    if (selectedCategory !== "All") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory]);

  const categories = ["All", ...new Set(posts.map((p) => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-chart-1/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-sm font-medium border border-chart-1/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>The Blog</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Thoughts & <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-purple-500">Tutorials</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Deep dives into development, design, and the tech industry.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-0 bg-chart-1/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-xl flex items-center px-4 py-2.5 transition-colors focus-within:border-chart-1/50">
              <Search className="w-4 h-4 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-chart-1 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card/30">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}