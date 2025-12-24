import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

// Custom easing curves
CustomEase.create("smooth", "0.645, 0.045, 0.355, 1.000"); // Smooth
CustomEase.create("bounce", "0.68, -0.55, 0.265, 1.55"); // Bounce
CustomEase.create("elastic", "0.175, 0.885, 0.32, 1.275"); // Elastic

// Global animation configurations
export const animationConfig = {
  defaults: {
    duration: 0.8,
    ease: "smooth",
  },
  scrollTrigger: {
    defaults: {
      start: "top 85%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      markers: false, // Set to true for debugging
    },
  },
};

// Initialize animations on page load
export const initAnimations = () => {
  // Prevent Flash of Unstyled Content
  gsap.set("body", { visibility: "visible" });

  // Smooth scrolling
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
};

// Utility functions for common animations
export const animations = {
  // Fade up animation
  fadeUp: (element, delay = 0) => {
    return gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: "smooth",
      clearProps: "all",
    });
  },

  // Stagger children
  staggerChildren: (parent, options = {}) => {
    const children = parent.children || parent.querySelectorAll("*");
    return gsap.from(children, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "smooth",
      ...options,
    });
  },

  // Typewriter effect
  typewriter: (element, text, speed = 0.05) => {
    return gsap.to(element, {
      text: text,
      duration: text.length * speed,
      ease: "none",
    });
  },

  // 3D flip animation
  flip3D: (element, duration = 1) => {
    return gsap.to(element, {
      rotationY: 360,
      duration,
      ease: "power2.out",
      transformOrigin: "center center",
    });
  },

  // Pulse animation
  pulse: (element, scale = 1.1) => {
    return gsap.to(element, {
      scale,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  },

  // Glitch effect
  glitch: (element, intensity = 10) => {
    const tl = gsap.timeline();
    tl.to(element, {
      x: intensity,
      duration: 0.05,
      ease: "power2.out",
    })
      .to(element, {
        x: -intensity,
        duration: 0.05,
      })
      .to(element, {
        x: 0,
        duration: 0.05,
      });
    return tl;
  },

  // Parallax effect
  parallax: (element, distance = 100) => {
    return gsap.to(element, {
      y: distance,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        scrub: true,
      },
    });
  },

  // Morphing gradient
  morphGradient: (element, colors = ["#00FFD1", "#4ADE80", "#3B82F6"]) => {
    return gsap.to(element, {
      background: `linear-gradient(45deg, ${colors.join(", ")})`,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  },

  // Split text animation
  splitText: (element, options = {}) => {
    const chars = element.textContent.split("");
    element.innerHTML = chars.map(char => 
      `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
    ).join("");

    const charsElements = element.querySelectorAll(".char");
    return gsap.from(charsElements, {
      opacity: 0,
      y: 20,
      rotationX: -90,
      duration: 0.5,
      stagger: 0.03,
      ease: "back.out(1.7)",
      ...options,
    });
  },
};

// Scroll-triggered animation system
export const createScrollAnimations = () => {
  // Animate all sections with data attributes
  const sections = document.querySelectorAll("[data-animate-section]");
  sections.forEach((section, index) => {
    gsap.from(section, {
      opacity: 0,
      y: 100,
      duration: 1,
      delay: index * 0.2,
      ease: "smooth",
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Animate cards with stagger
  const cards = document.querySelectorAll("[data-animate-card]");
  if (cards.length > 0) {
    gsap.from(cards, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: cards[0].parentElement,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // Animate progress bars
  const progressBars = document.querySelectorAll("[data-animate-progress]");
  progressBars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width") || "100%";
    gsap.fromTo(
      bar,
      { width: "0%" },
      {
        width: targetWidth,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bar,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

// Hover animation system
export const createHoverAnimations = () => {
  // Add hover effects to all interactive elements
  const hoverElements = document.querySelectorAll("[data-hover-effect]");
  
  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Text hover effects
  const textHoverElements = document.querySelectorAll("[data-hover-text]");
  textHoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      gsap.to(element, {
        color: "#00FFD1",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        color: "",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
};

// Initialize all animations
export const initAllAnimations = () => {
  initAnimations();
  createScrollAnimations();
  createHoverAnimations();
  
  // Add global CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .char {
      display: inline-block;
    }
    
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
};

export default {
  gsap,
  ScrollTrigger,
  animationConfig,
  animations,
  initAllAnimations,
};