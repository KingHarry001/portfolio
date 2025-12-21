import { useState, useEffect } from "react";

const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Ava Martinez",
    subtitle:
      "Harrison took our brand from 'meh' to magnetic. The new website not only looks amazing — it converts better, loads faster, and actually reflects who we are. People keep asking who built it. Total game-changer.",
    handle: "@avamartinez",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/avamartinez",
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Derek Lin",
    subtitle:
      "We hired Harrison to redesign our SaaS dashboard UI. Not only did he deliver pixel-perfect Figma files ahead of schedule, but he also helped us rethink flows and UX bottlenecks. Usage went up by 23% in the first month post-launch.",
    handle: "@derekux",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/derekux",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Jasmine Patel",
    subtitle:
      "What I love about working with Harrison is that he listens. He didn't just build a site — he built *our* site. The vibe, layout, messaging — all of it was tailored. It feels personal, polished, and pro.",
    handle: "@jasminemadeit",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #000)",
    url: "https://github.com/jasminemadeit",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Leo Turner",
    subtitle:
      "We've worked with agencies that overpromise and underdeliver. Harrison is the opposite. He's fast, sharp, and totally dialed into the latest design and dev trends. Our landing page build was smooth and stress-free.",
    handle: "@leoturner",
    borderColor: "#EC4899",
    gradient: "linear-gradient(180deg, #EC4899, #000)",
    url: "https://linkedin.com/in/leoturner",
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Nina K.",
    subtitle:
      "Our Webflow site kept breaking. Harrison came in, cleaned up the mess, and gave us a scalable setup with clean CMS collections and zero jank. Wish we found him sooner.",
    handle: "@ninakdesign",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(145deg, #F59E0B, #000)",
    url: "https://github.com/ninakdesign",
  },
  {
    image: "https://i.pravatar.cc/300?img=6",
    title: "Samuel Osei",
    subtitle:
      "Harrison's brand and logo design helped us finally look like the business we *actually* are. Everything just clicks now — social, web, pitch decks — it's all cohesive. He's got an eye, for real.",
    handle: "@samosei",
    borderColor: "#EF4444",
    gradient: "linear-gradient(180deg, #EF4444, #000)",
    url: "https://linkedin.com/in/samosei",
  },
  {
    image: "https://i.pravatar.cc/300?img=7",
    title: "Emily Zhao",
    subtitle:
      "I run a personal brand and needed a site that felt authentic — not corporate. Harrison nailed it. Mobile-first, super clean, and totally on-brand. The whole process was smooth from kickoff to launch.",
    handle: "@emzhao",
    borderColor: "#06B6D4",
    gradient: "linear-gradient(145deg, #06B6D4, #000)",
    url: "https://github.com/emzhao",
  },
  {
    image: "https://i.pravatar.cc/300?img=8",
    title: "Carlos Mendes",
    subtitle:
      "Working with Harrison was one of the best calls we made. Our product now looks as good as it works. He's part dev, part designer, part creative strategist — all in one.",
    handle: "@carloshq",
    borderColor: "#A855F7",
    gradient: "linear-gradient(180deg, #A855F7, #000)",
    url: "https://linkedin.com/in/carloshq",
  },
];

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
          className="group relative flex flex-col md:flex-row max-w-5xl w-full rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
          style={{
            borderColor: item.borderColor || "transparent",
            background: item.gradient,
          }}
        >
          {/* Image Section */}
          <div className="relative md:w-2/5 aspect-square md:aspect-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  {item.handle && (
                    <span className="text-white/70 text-sm">{item.handle}</span>
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
                  {item.subtitle}
                </p>
              </blockquote>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

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
          {items.map((item, index) => (
            <TestimonialCard
              key={index}
              item={item}
              isActive={index === current}
            />
          ))}

          {/* Navigation Arrows */}
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
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2">
          {items.map((_, index) => (
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
      </div>
    </section>
  );
};

export default TestimonialsSection;