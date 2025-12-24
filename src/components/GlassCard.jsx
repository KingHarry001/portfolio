import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const GlassCard = ({ 
  children, 
  className = "", 
  intensity = "md",
  hoverEffect = true,
  borderGradient = false,
  shadow = true,
  padding = "md",
  gradientFollow = false, // Added option to disable problematic gradient
  disable3DTilt = false // Added option to disable 3D tilt
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Memoized padding classes
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  // Memoized intensity classes
  const intensityClasses = {
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  // Optimized hover animation
  const handleMouseMove = useCallback((e) => {
    if (!hoverEffect || !cardRef.current || disable3DTilt) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate subtle tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 2; // Very subtle tilt
    const rotateX = ((centerY - y) / centerY) * -2;

    // Smooth tilt animation
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power1.out",
      overwrite: true
    });

    // Only update gradient if enabled
    if (gradientFollow) {
      const mouseXPercent = (x / rect.width) * 100;
      const mouseYPercent = (y / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    }
  }, [hoverEffect, gradientFollow, disable3DTilt]);

  const handleMouseEnter = useCallback(() => {
    if (!hoverEffect) return;
    
    setIsHovered(true);
    
    if (cardRef.current) {
      // Subtle hover animation
      gsap.to(cardRef.current, {
        y: -4, // Very subtle lift
        duration: 0.4,
        ease: "power2.out",
        boxShadow: shadow ? "0 12px 24px rgba(0, 0, 0, 0.15)" : "none"
      });
    }
  }, [hoverEffect, shadow]);

  const handleMouseLeave = useCallback(() => {
    if (!hoverEffect) return;
    
    setIsHovered(false);
    
    if (cardRef.current) {
      // Smooth reset animation
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: shadow ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none"
      });
    }
  }, [hoverEffect, shadow]);

  // Use optimized GSAP hook
  useGSAP(() => {
    const card = cardRef.current;
    if (!card || !hoverEffect) return;

    // Throttled mousemove handler
    let rafId;
    const throttledMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = null;
      });
    };

    // Add event listeners
    card.addEventListener("mousemove", throttledMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Cleanup event listeners
      card.removeEventListener("mousemove", throttledMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [hoverEffect, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Get chart color from CSS variable - FIXED VERSION
  const getChartColor = (number) => {
    // Get computed style from document root
    const root = document.documentElement;
    const colorValue = getComputedStyle(root)
      .getPropertyValue(`--chart-${number}`)
      .trim();
    
    // Convert HSL string to RGB for better opacity handling
    if (colorValue.startsWith('hsl')) {
      // Extract HSL values
      const matches = colorValue.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
      if (matches) {
        const [_, h, s, l] = matches;
        return `hsl(${h} ${s}% ${l}%)`;
      }
    }
    
    return colorValue || `hsl(var(--chart-${number}))`;
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative
        rounded-xl
        border
        ${borderGradient 
          ? "border-transparent"
          : "border-white/15"
        }
        ${intensityClasses[intensity]}
        bg-[hsl(var(--card))]/80
        backdrop-blur-md
        transition-all
        duration-300
        overflow-hidden
        ${shadow ? "shadow-lg" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'translateZ(0)',
        willChange: hoverEffect ? 'transform' : 'auto',
      }}
    >
      {/* Border gradient - FIXED with proper colors */}
      {borderGradient && (
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[hsl(var(--chart-1))]/30 via-[hsl(var(--chart-3))]/30 to-[hsl(var(--chart-5))]/30 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
      )}

      {/* Dynamic gradient overlay - simplified and fixed */}
      {hoverEffect && gradientFollow ? (
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              ${getChartColor(1)}20 0%,
              ${getChartColor(2)}10 25%,
              transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      ) : (
        // Static gradient overlay for better performance
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, 
              ${getChartColor(1)}15 0%,
              transparent 60%)`,
          }}
        />
      )}

      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" />

      {/* Content container with proper z-index */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Subtle top reflection - only when not hovered */}
      {!isHovered && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/5 via-white/2 to-transparent pointer-events-none rounded-t-xl" />
      )}
    </div>
  );
};

// Default props
GlassCard.defaultProps = {
  intensity: "md",
  hoverEffect: true,
  borderGradient: false,
  shadow: true,
  padding: "md",
  gradientFollow: false, // Disabled by default to prevent issues
  disable3DTilt: false
};

export default GlassCard;