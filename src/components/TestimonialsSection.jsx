// src/components/TestimonialsSection.jsx - UPDATED TO USE SUPABASE
import { useState, useEffect } from "react";
import { testimonialsAPI } from "../api/supabase";

const TestimonialCard = ({ item, isActive }) => {
  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center h-full px-4">
        <article
          onClick={() => item.url && window.open(item.url, "_blank", "noopener,noreferrer")}
          className="group relative flex flex-col md:flex-row max-w-5xl w-full rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer hover:scale-[1.02] bg-gradient-to-br from-gray-900 to-black"
          style={{
            borderColor: '#00FFD1',
          }}
        >
          {/* Image Section */}
          {item.avatar_url && (
            <div className="relative md:w-2/5 aspect-square md:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img
                src={item.avatar_url}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-1">{item.role}</p>
                  {item.company && (
                    <p className="text-white/50 text-sm">{item.company}</p>
                  )}
                </div>
              </div>

              <blockquote className="relative">
                <svg
                  className="absolute -top-2 -left-2 w-8 h-8 text-white/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/90 text-lg md:text-xl leading-relaxed italic pl-6">
                  {item.content}
                </p>
              </blockquote>

              {/* Rating Stars */}
              {item.rating && (
                <div className="flex items-center gap-1 pl-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsAPI.getAll();
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <section
        id="testimonial"
        className="py-20 bg-black relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section
        id="testimonial"
        className="py-20 bg-black relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Testi
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                monials
              </span>
            </h2>
            <div className="py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-white/60 mb-2">No Testimonials Yet</h3>
              <p className="text-white/40">Check back soon for client reviews!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonial"
      className="py-20 bg-black relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Testi
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              monials
            </span>
          </h2>
          <p className="text-white/60 text-lg">What clients say about working with Harrison</p>
        </div>

        {/* Carousel */}
        <div className="relative h-[600px] md:h-[500px] mb-12">
          {testimonials.map((item, index) => (
            <TestimonialCard
              key={item.id}
              item={item}
              isActive={index === current}
            />
          ))}

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === current
                    ? "w-12 h-3 bg-white"
                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {testimonials.length > 0 && (
          <div className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {testimonials.length}
              </div>
              <div className="text-white/60">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {testimonials.filter(t => t.featured).length}
              </div>
              <div className="text-white/60">Featured Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {(testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)}
              </div>
              <div className="text-white/60">Avg Rating</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;