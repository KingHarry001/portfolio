import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonialsAPI } from "../../api/supabase";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TestimonialCard = ({ item, isActive, isNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isNext ? 100 : -100 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        x: isActive ? 0 : (isNext ? 100 : -100),
        scale: isActive ? 1 : 0.9
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`absolute inset-0 flex items-center justify-center h-full px-4 ${!isActive && 'pointer-events-none'}`}
    >
      <article
        onClick={() => item.url && window.open(item.url, "_blank", "noopener,noreferrer")}
        className="group relative flex flex-col md:flex-row max-w-5xl w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 to-black backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/50 shadow-2xl"
      >
        {/* Image Section with Fallback */}
        <div className="relative md:w-2/5 aspect-square md:aspect-auto overflow-hidden">
          <img
            src={item.avatar_url || "/api/placeholder/400/400"}
            alt={item.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + item.name; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
          <Quote className="absolute top-8 right-8 w-12 h-12 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors" />
          
          <div className="space-y-6 relative">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-cyan-500/80 text-sm font-medium tracking-wide uppercase">{item.role}</p>
              {item.company && <p className="text-white/40 text-xs">{item.company}</p>}
            </div>

            <p className="text-white/80 text-lg md:text-xl leading-relaxed italic font-light">
              "{item.content}"
            </p>

            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < (item.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsAPI.getAll();
        setTestimonials(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(() => moveSlide(1), 6000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const moveSlide = (step) => {
    setDirection(step);
    setCurrent((prev) => (prev + step + testimonials.length) % testimonials.length);
  };

  if (loading) return <TestimonialSkeleton />;

  return (
    <section 
      id="testimonial" 
      className="py-24 bg-[#050505] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Feedback</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </header>

        <div className="relative h-[700px] md:h-[500px]">
          <AnimatePresence initial={false} mode="wait">
            <TestimonialCard 
              key={current}
              item={testimonials[current]} 
              isActive={true} 
              isNext={direction >= 0}
            />
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <button onClick={() => moveSlide(-1)} className="p-3 rounded-full border border-white/10 hover:border-cyan-500 hover:text-cyan-500 text-white transition-all group">
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === current ? "w-8 bg-cyan-500" : "w-2 bg-white/20"}`}
                />
              ))}
            </div>

            <button onClick={() => moveSlide(1)} className="p-3 rounded-full border border-white/10 hover:border-cyan-500 hover:text-cyan-500 text-white transition-all group">
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple Skeleton UI for loading
const TestimonialSkeleton = () => (
  <section className="py-24 bg-black flex flex-col items-center justify-center">
    <div className="w-full max-w-5xl h-[450px] bg-gray-900/50 animate-pulse rounded-3xl border border-white/5" />
    <p className="mt-8 text-white/20 animate-pulse">Synchronizing reviews...</p>
  </section>
);

export default TestimonialsSection;