import React, { useRef, useEffect } from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProductCard = ({ project }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  useGSAP(() => {
    // Initial setup for 3D effect
    gsap.set(cardRef.current, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    // Mouse move 3D rotation
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;

      // Animate 3D rotation
      gsap.to(card, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: "power2.out",
      });

      // Parallax effect on image
      const parallaxX = ((x - centerX) / centerX) * 20;
      const parallaxY = ((y - centerY) / centerY) * 20;

      gsap.to(imageRef.current, {
        duration: 0.5,
        x: parallaxX,
        y: parallaxY,
        ease: "power2.out",
      });

      // Move glow effect
      gsap.to(glowRef.current, {
        duration: 0.5,
        x: x - rect.left,
        y: y - rect.top,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Reset to original position
      gsap.to(cardRef.current, {
        duration: 0.8,
        rotateX: 0,
        rotateY: 0,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(imageRef.current, {
        duration: 0.8,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.5)",
      });

      // Hide glow
      gsap.to(glowRef.current, {
        duration: 0.3,
        opacity: 0,
      });
    };

    const handleMouseEnter = () => {
      // Show glow
      gsap.to(glowRef.current, {
        duration: 0.3,
        opacity: 0.6,
      });

      // Float animation
      gsap.to(cardRef.current, {
        duration: 1.5,
        y: -20,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll-triggered entrance animation
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 100,
        rotateY: 180,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // Stagger children animation
      const children = contentRef.current?.children || [];
      gsap.from(children, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      card.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
        card.removeEventListener("mouseenter", handleMouseEnter);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative group cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute w-64 h-64 bg-gradient-to-r from-chart-1/30 to-chart-5/30 rounded-full blur-3xl pointer-events-none opacity-0 -z-10"
      />

      {/* Glass morphism card */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-chart-1/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Project image with 3D effect */}
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <div
            ref={imageRef}
            className="w-full h-56 bg-gradient-to-br from-chart-1/20 to-chart-5/20 rounded-xl overflow-hidden"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground group-hover:text-chart-1 transition-colors duration-300">
              {project.title}
            </h3>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-chart-3 fill-chart-3" />
              <span className="text-sm font-semibold text-foreground">
                {project.rating}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-chart-1/10 text-chart-1 text-xs font-medium rounded-full border border-chart-1/20 hover:bg-chart-1/20 transition-all duration-300 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <button className="group/link flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-chart-1 to-chart-3 text-white rounded-lg hover:shadow-lg hover:shadow-chart-1/30 transition-all duration-300 hover:scale-105">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Live Demo</span>
              </button>
              <button className="group/github p-2 border border-border rounded-lg hover:border-chart-1 hover:bg-chart-1/10 transition-all duration-300 hover:scale-105">
                <Github className="w-5 h-5 text-foreground group-hover/github:text-chart-1" />
              </button>
            </div>
            
            {/* 3D depth indicator */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-6 bg-gradient-to-b from-chart-1 to-transparent rounded-full opacity-40 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    transform: `translateZ(${i * 10}px)`,
                    transitionDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;