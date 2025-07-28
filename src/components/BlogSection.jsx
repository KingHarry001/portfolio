import React from "react";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { blogPosts } from "../data/mock";

const BlogSection = () => {
  const handlePostClick = (post) => {
    // Mock blog post navigation
    console.log("Opening blog post:", post.title);
    alert(
      `Opening "${post.title}" - This would navigate to the full blog post`
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      Security: "border-red-500 text-red-400 bg-red-500/10",
      Development: "border-blue-500 text-blue-400 bg-blue-500/10",
      Crypto: "border-green-500 text-green-400 bg-green-500/10",
      Design: "border-purple-500 text-purple-400 bg-purple-500/10",
    };
    return (
      colors[category] || "border-gray-500 text-muted-foreground bg-gray-500/10"
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="blog" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Learning{" "}
            <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
              Journal
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sharing my journey through cybersecurity, development insights, and
            explorations into emerging technologies like Web3 and AI.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16 px-6 lg:px-0">
          <div className="bg-gradient-to-r from-chart-1/10 to-transparent border-l-4 border-[#00FFD1] p-1 mb-8">
            <div className="flex items-center gap-2 text-chart-1 font-medium">
              <BookOpen size={20} />
              <span>Featured Article</span>
            </div>
          </div>

          <div className="bg-background border border-white/10 overflow-hidden hover:border-[#00FFD1]/30 transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium border ${getCategoryColor(
                    blogPosts[0].category
                  )}`}
                >
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(blogPosts[0].publishDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {blogPosts[0].readTime}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-chart-1 transition-colors duration-300">
                {blogPosts[0].title}
              </h3>

              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {blogPosts[0].excerpt}
              </p>

              <button
                onClick={() => handlePostClick(blogPosts[0])}
                className="btn-primary bg-chart-1 group flex items-center gap-2"
              >
                Read Full Article
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Other Blog Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-0">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="group bg-background border border-white/10 overflow-hidden hover:border-[#00FFD1]/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium border ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-chart-1 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar size={14} />
                    {formatDate(post.publishDate)}
                  </div>

                  <button
                    onClick={() => handlePostClick(post)}
                    className="text-chart-1 hover:text-foreground transition-colors duration-300 font-medium group"
                  >
                    Read More
                    <ArrowRight
                      size={16}
                      className="inline ml-1 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Blog Statistics & CTA */}
        <div className="mt-16 bg-gradient-to-br from-white/5 to-[#00FFD1]/5 border border-white/10 p-8 w-[96%] lg:w-full   mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-6">
              Get notified when I publish new articles about cybersecurity,
              development, and emerging technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1 mb-2">
                {blogPosts.length}+
              </div>
              <div className="text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1 mb-2">500+</div>
              <div className="text-muted-foreground">Weekly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1 mb-2">4</div>
              <div className="text-muted-foreground">Topic Categories</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() =>
                alert("Newsletter signup would be implemented here")
              }
              className="btn-primary bg-chart-1"
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>

        {/* View All Articles Link */}
        <div className="text-center mt-12">
          <button
            onClick={() =>
              alert("View all articles page would be implemented here")
            }
            className="btn-secondary ring-2 ring-ring ring-2 ring-ring"
          >
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
