import { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

const HireMeButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const buttonRef = useRef(null);
  const glowRef = useRef(null);
  const sparkleRef = useRef(null);
  const lastScrollY = useRef(0);
  const hideTimeout = useRef(null);

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;

      // Auto-show after user stops scrolling
      clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!buttonRef.current || !glowRef.current) return;

    // Continuous pulsing glow animation
    const glowTimeline = gsap.timeline({ repeat: -1 });
    glowTimeline.to(glowRef.current, {
      scale: 1.3,
      opacity: 0.8,
      duration: 2,
      ease: 'power2.inOut',
    }).to(glowRef.current, {
      scale: 1,
      opacity: 0.4,
      duration: 2,
      ease: 'power2.inOut',
    });

    // Sparkle animation
    if (sparkleRef.current) {
      gsap.to(sparkleRef.current, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });
    }

    // Subtle floating animation
    gsap.to(buttonRef.current, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      glowTimeline.kill();
    };
  }, []);

  // Hover animations
  useEffect(() => {
    if (!buttonRef.current) return;

    if (isHovered) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    } else {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isHovered]);

  const handleClick = () => {
    // Scroll to contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: contactSection, offsetY: 100 },
        ease: 'power2.inOut',
      });
    }

    // Celebration animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        .wiggle-on-hover:hover {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>

      <div
        className={`fixed bottom-8 left-8 z-[60] transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-full pointer-events-none'
        }`}
      >
        {/* Glowing background effect */}
        <div
          ref={glowRef}
          className="absolute inset-0 bg-gradient-to-r from-chart-1/40 via-purple-500/40 to-blue-500/40 rounded-full blur-2xl -z-10"
          style={{ transform: 'scale(1)' }}
        />

        {/* Main button */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-chart-1 via-purple-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-chart-1/50 transition-all duration-300 overflow-hidden wiggle-on-hover"
          aria-label="Hire me for your project"
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Icon with sparkle */}
          <div className="relative">
            <Zap 
              size={24} 
              className="relative z-10 drop-shadow-lg" 
              fill="currentColor"
            />
            <div
              ref={sparkleRef}
              className="absolute -top-1 -right-1 z-20"
            >
              <Sparkles size={12} className="text-yellow-300" />
            </div>
          </div>

          {/* Text */}
          <span className="relative z-10 tracking-wide">
            Hire Me
          </span>

          {/* Arrow that slides in on hover */}
          <div
            className={`relative z-10 transition-all duration-300 ${
              isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            }`}
          >
            <ArrowRight size={20} />
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-colors duration-300" />
        </button>

        {/* Tooltip */}
        <div
          className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovered 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <div className="relative bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-chart-1/30 shadow-xl whitespace-nowrap">
            <div className="text-sm font-medium">Let's work together! 🚀</div>
            <div className="text-xs text-gray-400 mt-1">Click to get started</div>
            
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-900/95" />
          </div>
        </div>

        {/* Floating particles effect */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Mobile version (bottom center) */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-chart-1 to-purple-500 text-white font-bold rounded-full shadow-xl active:scale-95 transition-transform duration-200"
          aria-label="Hire me"
        >
          <Zap size={20} fill="currentColor" />
          <span>Hire Me</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
};

export default HireMeButton;