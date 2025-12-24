import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const GradientButton = ({ 
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const buttonRef = useRef(null);
  const gradientRef = useRef(null);
  const sparkleRef = useRef(null);

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary: "from-chart-1 to-chart-3",
    secondary: "from-chart-3 to-chart-5",
    accent: "from-chart-5 to-chart-1",
  };

  useEffect(() => {
    const button = buttonRef.current;
    const gradient = gradientRef.current;
    const sparkle = sparkleRef.current;

    if (!button || !gradient || !sparkle) return;

    // Animate gradient
    gsap.to(gradient, {
      backgroundPosition: "200% center",
      duration: 3,
      ease: "linear",
      repeat: -1,
    });

    // Create sparkles
    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.className = "absolute w-1 h-1 bg-white rounded-full";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      button.appendChild(sparkle);

      gsap.fromTo(
        sparkle,
        { scale: 0, opacity: 0 },
        {
          scale: 2,
          opacity: 1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
          onComplete: () => sparkle.remove(),
        }
      );
    };

    // Regular sparkle animation
    const sparkleInterval = setInterval(createSparkle, 300);

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(sparkle, {
        scale: 1.2,
        duration: 0.3,
        ease: "power2.out",
      });

      // Speed up gradient on hover
      gsap.to(gradient, {
        backgroundPosition: "400% center",
        duration: 1,
        ease: "linear",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(sparkle, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Reset gradient speed
      gsap.to(gradient, {
        backgroundPosition: "200% center",
        duration: 2,
        ease: "linear",
      });
    };

    // Click animation
    const handleClick = (e) => {
      if (disabled) return;

      // Ripple effect
      const ripple = document.createElement("div");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Button press animation
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });

      // Sparkle burst
      for (let i = 0; i < 8; i++) {
        setTimeout(createSparkle, i * 50);
      }
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    return () => {
      clearInterval(sparkleInterval);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl font-semibold
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {/* Animated gradient background */}
      <div
        ref={gradientRef}
        className={`absolute inset-0 bg-gradient-to-r ${variants[variant]} bg-[length:200%_auto]`}
      />

      {/* Sparkle container */}
      <div ref={sparkleRef} className="absolute inset-0 overflow-hidden">
        {/* Static sparkles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Border glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000" />

      {/* Content */}
      <span className="relative z-10 text-white flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Loading state */}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default GradientButton;