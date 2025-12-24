import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingSpinner3D = ({ size = 80, color = "#00FFD1" }) => {
  const containerRef = useRef(null);
  const spheresRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create 3D spheres
    const spheres = [];
    const sphereCount = 12;
    const radius = size / 2;

    for (let i = 0; i < sphereCount; i++) {
      const angle = (i / sphereCount) * Math.PI * 2;
      const sphere = document.createElement("div");
      sphere.className = "absolute w-2 h-2 rounded-full";
      sphere.style.backgroundColor = color;
      sphere.style.left = `${radius + Math.cos(angle) * radius}px`;
      sphere.style.top = `${radius + Math.sin(angle) * radius}px`;
      sphere.style.transform = `translateZ(${Math.sin(angle) * 20}px)`;
      container.appendChild(sphere);
      spheres.push(sphere);
    }
    spheresRef.current = spheres;

    // 3D Rotation animation
    gsap.to(container, {
      rotationY: 360,
      rotationX: 360,
      duration: 4,
      ease: "none",
      repeat: -1,
    });

    // Pulsating spheres
    spheres.forEach((sphere, i) => {
      gsap.to(sphere, {
        scale: 2,
        opacity: 0.6,
        duration: 0.8,
        delay: i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Orbit animation
    gsap.to(spheres, {
      rotationY: 360,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      stagger: 0.1,
    });

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 50;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 50;

      gsap.to(container, {
        rotationY: x,
        rotationX: -y,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      spheres.forEach(sphere => sphere.remove());
    };
  }, [size, color]);

  return (
    <div className="relative flex items-center justify-center">
      {/* 3D Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Center glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        className="absolute border-2 border-transparent rounded-full animate-spin"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          borderTopColor: color,
          borderRightColor: `${color}80`,
          borderBottomColor: `${color}40`,
          borderLeftColor: `${color}20`,
          animationDuration: "3s",
        }}
      />

      {/* Text */}
      <div className="absolute -bottom-8 text-center">
        <p
          className="text-sm font-medium bg-gradient-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent"
          style={{ color }}
        >
          Loading...
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner3D;