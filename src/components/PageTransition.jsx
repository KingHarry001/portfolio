import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useGSAP(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  useGSAP(() => {
    if (transitionStage === "fadeIn") {
      gsap.fromTo(
        ".page-content",
        {
          opacity: 0,
          y: 30,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    }

    if (transitionStage === "fadeOut") {
      gsap.to(".page-content", {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [transitionStage]);

  return (
    <>
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none ${
          transitionStage === "fadeOut" ? "opacity-100" : "opacity-0"
        } transition-opacity duration-600`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5">
          {/* Animated loading bars */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
            <div className="h-full w-1/2 bg-white animate-loading-bar" />
          </div>
          
          {/* Loading spinner */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-20 h-20 border-4 border-transparent border-t-white rounded-full"
                  style={{
                    animation: `spin ${1 + i * 0.2}s linear infinite`,
                    animationDelay: `${i * 0.1}s`,
                    borderTopColor: `rgba(255, 255, 255, ${0.8 - i * 0.2})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className={`page-content ${transitionStage}`}>
        {children}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default PageTransition;