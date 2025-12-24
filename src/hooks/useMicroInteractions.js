import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useMicroInteractions = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Click animation
    const handleClick = (e) => {
      // Ripple effect
      const ripple = document.createElement("span");
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 209, 0.3);
        transform: scale(0);
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;

      element.appendChild(ripple);

      gsap.to(ripple, {
        scale: 3,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });

      // Scale feedback
      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

      // Add glow effect
      gsap.to(element, {
        boxShadow: "0 0 30px rgba(0, 255, 209, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Remove glow
      gsap.to(element, {
        boxShadow: "0 0 0px rgba(0, 255, 209, 0)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Active state animation
    const handleMouseDown = () => {
      gsap.to(element, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    // Add event listeners
    element.addEventListener("click", handleClick);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);

    // Subtle idle animation
    const idleAnimation = gsap.to(element, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true,
    });

    // Start idle animation when not interacted with
    let idleTimeout;
    const resetIdle = () => {
      idleAnimation.pause();
      idleAnimation.progress(0);
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        idleAnimation.play();
      }, 5000); // Start idle animation after 5 seconds of inactivity
    };

    // Track interaction
    const events = ["mousemove", "click", "touchstart"];
    events.forEach((event) => {
      element.addEventListener(event, resetIdle);
    });

    resetIdle(); // Initial reset

    return () => {
      // Cleanup
      element.removeEventListener("click", handleClick);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      
      events.forEach((event) => {
        element.removeEventListener(event, resetIdle);
      });
      
      clearTimeout(idleTimeout);
      idleAnimation.kill();
    };
  }, []);

  return elementRef;
};

// Hook for input field micro-interactions
export const useInputMicroInteractions = () => {
  const inputRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const label = labelRef.current;

    if (!input || !label) return;

    const handleFocus = () => {
      gsap.to(label, {
        y: -25,
        scale: 0.8,
        color: "#00FFD1",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(input, {
        borderColor: "#00FFD1",
        duration: 0.3,
        ease: "power2.out",
      });

      // Add floating particles
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement("div");
        particle.className = "input-particle";
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00FFD1;
          border-radius: 50%;
          pointer-events: none;
          left: ${Math.random() * 100}%;
          top: 50%;
        `;
        
        input.parentElement.appendChild(particle);

        gsap.to(particle, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => particle.remove(),
        });
      }
    };

    const handleBlur = () => {
      if (!input.value) {
        gsap.to(label, {
          y: 0,
          scale: 1,
          color: "",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      gsap.to(input, {
        borderColor: "",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleInput = () => {
      // Character typing effect
      gsap.fromTo(
        input,
        { scale: 1.01 },
        {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
        }
      );
    };

    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);
    input.addEventListener("input", handleInput);

    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
      input.removeEventListener("input", handleInput);
    };
  }, []);

  return { inputRef, labelRef };
};

// Hook for toggle switch micro-interactions
export const useToggleMicroInteractions = () => {
  const toggleRef = useRef(null);

  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const handleChange = (e) => {
      const isChecked = e.target.checked;
      
      // Thumb animation
      const thumb = toggle.querySelector(".toggle-thumb");
      if (thumb) {
        gsap.to(thumb, {
          x: isChecked ? "100%" : "0%",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Background color change
      gsap.to(toggle, {
        backgroundColor: isChecked ? "#00FFD1" : "#ccc",
        duration: 0.3,
        ease: "power2.out",
      });

      // Sparkle effect
      if (isChecked) {
        for (let i = 0; i < 5; i++) {
          const sparkle = document.createElement("div");
          sparkle.className = "toggle-sparkle";
          sparkle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            left: ${50 + Math.random() * 20 - 10}%;
            top: ${50 + Math.random() * 20 - 10}%;
          `;
          
          toggle.appendChild(sparkle);

          gsap.to(sparkle, {
            scale: 3,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => sparkle.remove(),
          });
        }
      }
    };

    toggle.addEventListener("change", handleChange);

    return () => {
      toggle.removeEventListener("change", handleChange);
    };
  }, []);

  return toggleRef;
};

// Hook for progress indicator micro-interactions
export const useProgressMicroInteractions = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += Math.random() * 5;
      if (progressValue > 100) progressValue = 100;

      // Update progress bar with animation
      gsap.to(progress, {
        width: `${progressValue}%`,
        duration: 0.5,
        ease: "power2.out",
      });

      // Add particle effect when progress increases
      if (Math.random() > 0.7) {
        const particle = document.createElement("div");
        particle.className = "progress-particle";
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00FFD1;
          border-radius: 50%;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        `;
        
        progress.parentElement.appendChild(particle);

        gsap.to(particle, {
          x: -20,
          y: -10,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => particle.remove(),
        });
      }

      // Completion effect
      if (progressValue >= 100) {
        clearInterval(interval);
        
        // Celebration particles
        for (let i = 0; i < 10; i++) {
          const confetti = document.createElement("div");
          confetti.className = "progress-confetti";
          confetti.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: #00FFD1;
            border-radius: 2px;
            right: 0;
            top: 50%;
            pointer-events: none;
          `;
          
          progress.parentElement.appendChild(confetti);

          gsap.to(confetti, {
            x: Math.random() * 100 - 50,
            y: Math.random() * -100 - 50,
            rotation: Math.random() * 360,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => confetti.remove(),
          });
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return progressRef;
};

export default {
  useMicroInteractions,
  useInputMicroInteractions,
  useToggleMicroInteractions,
  useProgressMicroInteractions,
};