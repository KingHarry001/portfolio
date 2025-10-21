import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Star,
  Zap,
  Palette,
  Camera,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import InfiniteScroll from "../components/react-ui/InfiniteScroll";
import Nexus1 from "../assets/nexus1.png";
import Nexus2 from "../assets/nexus2.png";
import Nexus3 from "../assets/nexus3.png";
import Nexus4 from "../assets/nexus4.png";

const features = [
  {
    title: "Logo & Brand Identity.",
    desc: [
      "✔ Custom logos",
      "✔ Color palette",
      "✔ Typography",
      "and brand guidelines.",
    ],
    icon: <Palette className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Marketing Materials",
    desc: [
      "✔ Flyers",
      "✔ Brochures",
      "✔ Presentations",
      "and more for your campaigns.",
    ],
    icon: <Zap className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Social Media Graphics",
    desc: ["✔ Branded post templates", "✔ Story covers", "and ad creatives."],
    icon: <Camera className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Print Design",
    desc: ["✔ Packaging", "✔ posters", "✔ menus", "and business cards."],
    icon: <Star className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
  },
];

const infinitescrollitems = [
  { content: Nexus1, type: "image" },
  { content: Nexus2, type: "image" },
  { content: Nexus3, type: "image" },
  { content: Nexus4, type: "text" },
  { content: "Text Item 3", type: "text" },
  { content: "Text Item 5", type: "text" },
  { content: "Text Item 7", type: "text" },
  { content: "Paragraph Item 8", type: "text" },
  { content: "Text Item 9", type: "text" },
  { content: "Paragraph Item 10", type: "text" },
  { content: "Text Item 11", type: "text" },
  { content: "Paragraph Item 12", type: "text" },
  { content: "Texat Item 13", type: "text" },
  { content: "Paragraph Item 14", type: "text" },
];

const portfolioImages = Array.from({ length: 9 }, (_, i) => ({
  src: `https://source.unsplash.com/600x400/?design,branding,creative&sig=${
    i + 1
  }`,
  alt: `Graphic Design Work ${i + 1}`,
}));

// Enhanced Particles Component
const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: (particle.y + particle.speed) % 100,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Beams Component
const Beams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20"
          style={{
            left: `${10 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            animation: `beam 4s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Animated Feature Card
const FeatureCard = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
        />

        {/* Icon */}
        <div
          className={`inline-flex p-3 rounded-full bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          {feature.icon}
        </div>

        <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
          {feature.title}
        </h3>
        <div className="space-y-2">
          {feature.desc.map((item, idx) => (
            <div
              key={idx}
              className={`text-gray-300 transform transition-all duration-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-5 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200 + idx * 100}ms` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Animated Portfolio Grid
const PortfolioGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {portfolioImages.map(({ src, alt }, idx) => (
          <div
            key={idx}
            className="group relative bg-gray-900 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedImage({ src, alt })}
            style={{
              transform:
                hoveredIndex === idx
                  ? "translateY(-8px) scale(1.02)"
                  : "translateY(0) scale(1)",
              transition: "all 0.3s ease-out",
            }}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              View Project
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "zoomIn 0.3s ease-out" }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors z-10"
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

// Floating Action Button
const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <a
        href="#contact"
        className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
      >
        <Mail className="w-5 h-5" />
        <span className="font-semibold">Let's Talk</span>
      </a>
    </div>
  );
};

const GraphicsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToNext = () => {
    const element = document.querySelector("#next");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <Beams />
          <Particles />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 z-10" />

        {/* Content */}
        <div
          className={`relative z-20 transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-8 bg-gray-900/50 backdrop-blur-sm border-chart-1 border">
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse mr-3" />
            <span className="text-chart-1 text-sm font-medium">
              Available for new projects
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Graphic Design that <br />
            <span className="relative bg-gradient-to-r from-chart-1 to-gray-300 bg-clip-text text-transparent">
              Elevates Brands
              <div
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transform scale-x-0"
                style={{ animation: "scaleX 2s ease-out 1s forwards" }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl max-w-2xl mx-auto text-gray-300 mb-12 transform transition-all duration-1000 delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            Complete brand identity, logo design, and striking visual solutions
            tailored for your business.
          </p>

          {/* CTA Button */}
          <div
            className={`transform transition-all duration-1000 delay-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              <span>Get Started</span>
              <ChevronDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <button
              onClick={scrollToNext}
              className="text-white/70 hover:text-cyan-400 transition-colors duration-300 animate-bounce"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="next" className="py-24 px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-chart-1 to-gray-300 bg-clip-text text-transparent">
            What's Included
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r to-chart-1 from-gray-300 bg-clip-text text-transparent">
            Recent Work
          </h2>
          <p className="text-gray-400 text-lg">
            Showcasing our latest creative projects
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mt-4" />
        </div>
        {/* <PortfolioGrid /> */}
        <div
          className="bg-black text-white"
          style={{ height: "500px", position: "relative" }}
        >
          <div className="absolute inset-0 z-0 pointer-events-none w-full">
            <Particles />
          </div>

          <InfiniteScroll
            items={infinitescrollitems}
            isTilted={true}
            tiltDirection="left"
            autoplay={true}
            autoplaySpeed={1}
            autoplayDirection="down"
            pauseOnHover={true}
            onItemClick={(item) => setSelectedImage(item)}
          />
        </div>

        {/* Replace your existing modal code with this: */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)} // close on overlay click
          >
            <div className="relative bg-black rounded-lg shadow-lg max-w-4xl max-h-[90vh] p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white text-xl hover:text-gray-300 z-10"
              >
                ✕
              </button>
              <div className="max-h-[80vh] overflow-auto">
                {/* Render content based on type */}
                {selectedImage.type === "image" ||
                (typeof selectedImage.content === "string" &&
                  (selectedImage.content.startsWith("http") ||
                    selectedImage.content.startsWith("/") ||
                    selectedImage.content.startsWith("data:"))) ? (
                  <img
                    src={selectedImage.content}
                    alt="Modal content"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-white text-center p-8 text-xl">
                    {selectedImage.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Enhanced Pricing Section */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-cyan-900/30" />
        <div className="absolute inset-0">
          <Particles />
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Design Package
          </h2>
          <p className="text-gray-300 mb-12 text-lg">
            Premium quality design at a flat rate
          </p>

          <div className="inline-block relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

            <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 shadow-2xl">
              {/* Price */}
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                $500
              </div>

              {/* Timeline */}
              <p className="text-lg text-gray-300 mb-8">Timeline: 1–2 weeks</p>

              {/* Features */}
              <ul className="text-left text-gray-400 mb-8 space-y-3">
                {[
                  "Custom branding",
                  "2 rounds of revisions",
                  "Delivery: AI, PSD, PNG, PDF",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 group-hover:text-gray-200 transition-colors"
                  >
                    <Check className="w-5 h-5 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="#contact"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
              >
                <Mail className="w-5 h-5" />
                Book Your Spot
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Let's Create Something Amazing
          </h2>
          <p className="text-gray-400 text-lg">
            Ready to elevate your brand? Get in touch!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Mail className="w-6 h-6" />,
              title: "Email",
              value: "nexus.dynasty.org@gmail.com",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Phone className="w-6 h-6" />,
              title: "Phone",
              value: "+234 903 816 3213",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Location",
              value: "Lagos, Nigeria",
              color: "from-green-500 to-emerald-500",
            },
          ].map((contact, idx) => (
            <div key={idx} className="group text-center">
              <div
                className={`inline-flex p-4 rounded-full bg-gradient-to-br ${contact.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {contact.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                {contact.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes scaleX {
          to {
            transform: scaleX(1);
          }
        }

        @keyframes beam {
          0%,
          100% {
            transform: translateY(-100%) scaleY(0);
          }
          50% {
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: #000;
        }
      `}</style>
    </div>
  );
};

export default GraphicsPage;
