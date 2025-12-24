import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState("default");
  const cursorRef = React.useRef(null);
  const followerRef = React.useRef(null);
  const clickEffectRef = React.useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Hide default cursor
    document.body.style.cursor = "none";

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Click effect
    const handleClick = (e) => {
      // Create ripple effect
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.8 },
        {
          scale: 3,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    // Hover effects
    const handleMouseEnter = (e) => {
      const target = e.target;
      
      if (target.matches("a, button, [role='button']")) {
        setCursorType("pointer");
        gsap.to(cursor, { scale: 1.5, duration: 0.2 });
        gsap.to(follower, { scale: 2, opacity: 0.3, duration: 0.2 });
      } else if (target.matches("input, textarea, select")) {
        setCursorType("text");
        gsap.to(follower, { scale: 1.5, duration: 0.2 });
      } else if (target.matches(".drag-item, [draggable='true']")) {
        setCursorType("grab");
      }
    };

    const handleMouseLeave = () => {
      setCursorType("default");
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, opacity: 0.2, duration: 0.2 });
    };

    // Drag effects
    const handleDragStart = () => {
      setCursorType("grabbing");
      gsap.to(cursor, { scale: 0.8, duration: 0.2 });
      gsap.to(follower, { scale: 1.2, duration: 0.2 });
    };

    const handleDragEnd = () => {
      setCursorType("grab");
      gsap.to(cursor, { scale: 1.5, duration: 0.2 });
      gsap.to(follower, { scale: 2, duration: 0.2 });
    };

    // Add event listeners
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", handleClick);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={`fixed w-4 h-4 bg-chart-1 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference ${
          cursorType === "pointer" ? "cursor-pointer" : ""
        }`}
      >
        {/* Cursor ring */}
        <div className="absolute inset-0 border-2 border-chart-1/50 rounded-full animate-ping" />
      </div>

      {/* Cursor follower */}
      <div
        ref={followerRef}
        className="fixed w-8 h-8 border-2 border-chart-1/30 rounded-full pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 opacity-20"
      />

      {/* Click effect container */}
      <div ref={clickEffectRef} />

      <style jsx>{`
        .cursor-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(var(--chart-1-rgb), 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;