import React, { useEffect, useRef, useState } from "react";
import { Calendar, Clock, ArrowRight, BookOpen, Mail, CheckCircle } from "lucide-react";

// We'll need to add this for GSAP - note: this is a mock since we can't import GSAP directly
// In your actual implementation, make sure to install and import GSAP with ScrollTrigger
const gsap = {
  registerPlugin: () => {},
  context: (callback) => {
    const ctx = callback();
    return { revert: () => {} };
  },
  set: () => {},
  to: () => {},
  timeline: () => ({ paused: true, play: () => {}, reverse: () => {} }),
  utils: { toArray: (selector) => document.querySelectorAll(selector) }
};

const ScrollTrigger = {
  create: () => ({ kill: () => {} }),
  getAll: () => []
};

// Mock data for demonstration
const blogPosts = [
  {
    id: 1,
    title: "Advanced Penetration Testing Techniques for Modern Web Applications",
    excerpt: "Explore cutting-edge methodologies and tools used in contemporary penetration testing. Learn about automated scanning, manual verification techniques, and how to identify complex vulnerabilities in modern web architectures.",
    category: "Security",
    readTime: "8 min read",
    publishDate: "2024-12-15",
  },
  {
    id: 2,
    title: "Building Scalable React Applications with Modern Architecture",
    excerpt: "Deep dive into best practices for structuring large-scale React applications. Covers component composition, state management patterns, and performance optimization strategies.",
    category: "Development",
    readTime: "12 min read",
    publishDate: "2024-12-10",
  },
  {
    id: 3,
    title: "Understanding Smart Contract Security Vulnerabilities",
    excerpt: "A comprehensive guide to common security issues in smart contracts, including reentrancy attacks, integer overflows, and best practices for secure blockchain development.",
    category: "Crypto",
    readTime: "15 min read",
    publishDate: "2024-12-05",
  },
  {
    id: 4,
    title: "The Psychology of User Experience Design",
    excerpt: "How cognitive biases and psychological principles influence user behavior and how to design interfaces that align with human psychology.",
    category: "Design",
    readTime: "10 min read",
    publishDate: "2024-11-28",
  },
  {
    id: 5,
    title: "Zero Trust Architecture Implementation Guide",
    excerpt: "Step-by-step approach to implementing zero trust security models in enterprise environments, including practical examples and common pitfalls.",
    category: "Security",
    readTime: "18 min read",
    publishDate: "2024-11-20",
  }
];

const BlogSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sectionRef = useRef();
  const headerRef = useRef();
  const featuredRef = useRef();
  const gridRef = useRef();
  const statsRef = useRef();
  const newsletterRef = useRef();

  const handlePostClick = (post) => {
    console.log("Opening blog post:", post.title);
    alert(`Opening "${post.title}" - This would navigate to the full blog post`);
  };

  const handleNewsletterSubmit = async () => {
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Security: "border-red-400/50 text-red-300 bg-red-500/10 shadow-red-500/20",
      Development: "border-blue-400/50 text-blue-300 bg-blue-500/10 shadow-blue-500/20",
      Crypto: "border-green-400/50 text-green-300 bg-green-500/10 shadow-green-500/20",
      Design: "border-purple-400/50 text-purple-300 bg-purple-500/10 shadow-purple-500/20",
    };
    return colors[category] || "border-gray-500/50 text-gray-300 bg-gray-500/10";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Simulate scroll animations with CSS classes
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Animate counters
    const counters = document.querySelectorAll('.stats-value');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const finalValue = parseInt(entry.target.textContent.replace(/[^0-9]/g, ""));
          const suffix = entry.target.textContent.replace(/[0-9]/g, "");
          let currentValue = 0;
          const increment = finalValue / 60; // 60 frames for smooth animation
          
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              currentValue = finalValue;
              clearInterval(timer);
            }
            entry.target.textContent = Math.floor(currentValue) + suffix;
          }, 33); // ~30fps
        }
      });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    return () => {
      observer.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-card {
          opacity: 0;
          transform: translateY(80px) scale(0.9);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-card.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 255, 209, 0.25);
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .glow-on-hover:hover {
          box-shadow: 0 0 20px rgba(0, 255, 209, 0.5);
        }
        
        .newsletter-input:focus {
          box-shadow: 0 0 0 3px rgba(0, 255, 209, 0.3);
        }
      `}</style>
      
      <section ref={sectionRef} id="blog" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,255,209,0.1),transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-20 animate-on-scroll">
            <h2 className="text-3xl sm:text-6xl font-bold text-white mb-6 floating">
              Learning{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Journal
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Sharing my journey through cybersecurity, development insights, and
              explorations into emerging technologies like Web3 and AI.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-20 animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="bg-gradient-to-r from-cyan-400/20 to-transparent border-l-4 border-cyan-400 p-4 mb-8 rounded-r-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 text-white font-medium">
                <BookOpen size={24} className="text-cyan-400" />
                <span className="sm:text-lg">Featured Article</span>
              </div>
            </div>

            <div ref={featuredRef} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500 shadow-2xl glow-on-hover">
              <div className="p-7">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`inline-block px-4 py-2 text-sm font-medium border rounded-full shadow-lg ${getCategoryColor(blogPosts[0].category)}`}>
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(blogPosts[0].publishDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 hover:text-cyan-400 transition-colors duration-300 cursor-pointer">
                  {blogPosts[0].title}
                </h3>

                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>

                <button
                  onClick={() => handlePostClick(blogPosts[0])}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 font-semibold flex items-center gap-3 group transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl rounded-2xl"
                >
                  Read Full Article
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Other Blog Posts */}
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {blogPosts.slice(1).map((post, index) => (
              <article
                key={post.id}
                className={`blog-card animate-card animate-on-scroll group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-500 cursor-pointer shadow-xl hover:shadow-cyan-500/20`}
                style={{ transitionDelay: `${0.1 * index}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium border rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-300 mb-4 leading-relaxed line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Calendar size={14} />
                      {formatDate(post.publishDate)}
                    </div>

                    <button
                      onClick={() => handlePostClick(post)}
                      className="text-cyan-400 hover:text-white transition-colors duration-300 font-medium group flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Blog Statistics & Newsletter */}
          <div className="animate-on-scroll bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-7 shadow-2xl glow-on-hover" style={{ transitionDelay: '0.3s' }}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Get notified when I publish new articles about cybersecurity,
                development, and emerging technologies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                <div className="text-3xl font-bold text-cyan-400 mb-2 stats-value">
                  {blogPosts.length}+
                </div>
                <div className="text-slate-400 font-medium">Articles Published</div>
              </div>
              <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.5s' }}>
                <div className="text-3xl font-bold text-cyan-400 mb-2 stats-value">500+</div>
                <div className="text-slate-400 font-medium">Weekly Readers</div>
              </div>
              <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.6s' }}>
                <div className="text-3xl font-bold text-cyan-400 mb-2 stats-value">4</div>
                <div className="text-slate-400 font-medium">Topic Categories</div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto animate-on-scroll" style={{ transitionDelay: '0.7s' }}>
              {!isSubscribed ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="newsletter-input w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                    />
                  </div>
                  <button
                    onClick={handleNewsletterSubmit}
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Subscribing...
                      </>
                    ) : (
                      'Subscribe to Newsletter'
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 animate-on-scroll">
                  <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                  <h4 className="text-xl font-bold text-white mb-2">Successfully Subscribed!</h4>
                  <p className="text-slate-300">Thank you for joining our community. You'll receive updates soon!</p>
                </div>
              )}
            </div>
          </div>

          {/* View All Articles Link */}
          <div className="text-center mt-12 animate-on-scroll" style={{ transitionDelay: '0.8s' }}>
            <button
              onClick={() => alert("View all articles page would be implemented here")}
              className="bg-transparent border-2 border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-slate-800/50 hover:shadow-lg"
            >
              View All Articles
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;