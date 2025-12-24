import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import { personalInfo } from "../../data/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { resumesAPI } from "../../api/supabase";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [activeResume, setActiveResume] = useState(null);

  const fullText = personalInfo.tagline;
  const statsRef = useRef();
  const sectionRef = useRef();
  const heroContentRef = useRef();
  const statusBadgeRef = useRef();
  const mainHeadingRef = useRef();
  const roleAnimationRef = useRef();
  const bioRef = useRef();
  const buttonsRef = useRef();
  const rightSideRef = useRef();
  const scrollIndicatorRef = useRef();
  const glowEffectRef = useRef();

  // Memoize roles to prevent recreation on every render
  const roles = useMemo(
    () => [
      "Web Developer",
      "Web Designer",
      "Cybersecurity Expert",
      "Founder",
      "Creator",
    ],
    []
  );

  // Memoize file download URL
  const fileDownloadURL = useMemo(
    () =>
      "https://drive.google.com/uc?export=download&id=1Gi4LJY5ZaEzsHm1O_FPusCb7mb-TSyLN",
    []
  );

  // UPDATED: Scroll-triggered animations instead of mount animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states (hidden)
      gsap.set(
        [
          statusBadgeRef.current,
          mainHeadingRef.current,
          roleAnimationRef.current,
          bioRef.current,
          buttonsRef.current,
          statsRef.current,
        ],
        {
          opacity: 0,
          y: 50,
        }
      );

      gsap.set(rightSideRef.current, {
        opacity: 0,
        scale: 0.8,
        rotationY: 15,
      });

      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
      });

      // Create scroll-triggered timeline
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 1,
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // Animation starts when section is 80% visible
          end: "top 20%", // Animation completes when section is 20% from top
          toggleActions: "play none none reverse", // Play on enter, reverse on leave
          // Uncomment below for debugging
          // markers: true
        },
      });

      // Animate elements in sequence (same timing as before)
      tl.to(statusBadgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
        .to(
          mainHeadingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          roleAnimationRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .to(
          bioRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.4"
        )
        .to(
          rightSideRef.current,
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "bounce.out",
          },
          "-=0.2"
        );

      // Continuous floating animation (independent of scroll)
      gsap.to(rightSideRef.current?.querySelector(".floating-element"), {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Glow effect animation (continuous)
      gsap.to(glowEffectRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // UPDATED: Enhanced parallax effect with better scroll responsiveness
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(rightSideRef.current, {
            y: -100 * progress,
            rotationX: 10 * progress,
            duration: 0.3,
            ease: "none",
          });

          // Add subtle parallax to other elements
          gsap.to(heroContentRef.current, {
            y: -20 * progress,
            duration: 0.3,
            ease: "none",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // UPDATED: Stats animation with different scroll trigger
  useEffect(() => {
    if (!statsRef.current) return;

    const ctx = gsap.context(() => {
      const statEls = gsap.utils.toArray(
        statsRef.current.querySelectorAll(".stats-value")
      );

      statEls.forEach((el) => {
        const finalValue = parseInt(el.textContent.replace(/[^0-9]/g, ""));
        const suffix = el.textContent.replace(/[0-9]/g, "");
        const obj = { value: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%", // Start earlier for better visibility
          toggleActions: "play none none reset",
          onEnter: () => {
            gsap.to(obj, {
              value: finalValue,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                el.innerText =
                  new Intl.NumberFormat().format(Math.floor(obj.value)) +
                  suffix;
              },
            });

            // Enhanced scale animation
            gsap.fromTo(
              el,
              { scale: 0.8, rotation: -5 },
              {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "back.out(1.7)",
              }
            );
          },
        });
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  // Button hover animations (unchanged)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const buttons = gsap.utils.toArray(
        buttonsRef.current?.querySelectorAll("button") || []
      );

      buttons.forEach((button) => {
        const icon = button.querySelector("svg");

        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1.1,
              duration: 0.3,
              ease: "back.out(1.7)",
            });
          }
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      });
    }, buttonsRef);

    return () => ctx.revert();
  }, []);

  // UPDATED: Delayed typewriter effect that starts with scroll trigger
  useEffect(() => {
    // Create a ScrollTrigger to start typewriter effect
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        // Start typewriter after a small delay
        setTimeout(() => {
          setCurrentIndex(0);
        }, 800); // Delay to sync with other animations
      },
      onLeaveBack: () => {
        // Reset typewriter when scrolling back up
        setCurrentIndex(0);
        setDisplayText("");
      },
    });

    return () => trigger.kill();
  }, []);

  // Typewriter effect logic (unchanged)
  useEffect(() => {
    if (currentIndex > 0 && currentIndex <= fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  // Role cycling animation (unchanged)
  useEffect(() => {
    const current = roles[roleIndex];
    const isEnd = char === current.length;
    const isStart = char === 0;

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(current.substring(0, char + 1));
          setChar((c) => c + 1);
          if (isEnd) setDeleting(true);
        } else {
          setText(current.substring(0, char - 1));
          setChar((c) => c - 1);
          if (isStart) {
            setDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isEnd ? 2000 : deleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [char, deleting, roleIndex, roles]);

    useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const resume = await resumesAPI.getActive();
        setActiveResume(resume);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchActiveResume();
  }, []);

  const scrollToAbout = useCallback(() => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const handleResumeDownload = useCallback(() => {
    if (activeResume?.file_url) {
      window.open(activeResume.file_url, "_blank");
    } else {
      console.log("No active resume available");
    }
  }, [activeResume]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
    >
      {/* Optimized Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
          {/* Left Content */}
          <div ref={heroContentRef} className="space-y-8">
            <div className="space-y-6">
              {/* Status Badge */}
              <div
                ref={statusBadgeRef}
                className="inline-flex items-center px-4 py-2 bg-chart-1/10 border border-chart-1/20 rounded-full"
              >
                <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse mr-3" />
                <span className="text-chart-1 text-sm font-medium">
                  Available for new projects
                </span>
              </div>

              {/* Main Heading */}
              <h1
                ref={mainHeadingRef}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
              >
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>

              {/* Role Animation */}
              <div ref={roleAnimationRef} className="space-y-4">
                <h2 className="text-xl lg:text-2xl text-muted-foreground font-medium">
                  I'm a{" "}
                  <span className="font-bold bg-gradient-to-r from-[#9c43fe] via-[#4cc2e9] to-[#1014cc] bg-clip-text text-transparent">
                    {text}
                  </span>
                  <span className="text-foreground animate-pulse">|</span>
                </h2>

                {/* Tagline with typewriter effect */}
                <p className="text-lg lg:text-xl text-muted-foreground font-medium">
                  {displayText}
                  {currentIndex > 0 && currentIndex <= fullText.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>

              {/* Bio */}
              <p
                ref={bioRef}
                className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg"
              >
                {personalInfo.bio}
              </p>
            </div>

            {/* CTA Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToAbout}
                className="btn-primary"
                aria-label="View my work"
              >
                <span>View My Work</span>
                <ExternalLink size={18} />
              </button>

              {activeResume && (
                <button
                  onClick={handleResumeDownload}
                  className="btn-secondary"
                  aria-label="Download resume"
                >
                  <Download size={18} />
                  <span>Download Resume</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Side - 3D Placeholder */}
          <div
            ref={rightSideRef}
            className="relative h-[500px] lg:h-[700px] flex items-center justify-center"
          >
            <div className="w-full h-full max-w-[700px] relative">
              {/* Enhanced 3D placeholder */}
              <div className="floating-element w-full h-full bg-gradient-to-br from-chart-1/20 via-black/50 to-transparent flex items-center justify-center backdrop-blur-sm border border-white/10 rounded-full">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto">
                    <div className="w-32 h-32 lg:w-64 lg:h-64 bg-gradient-to-br from-chart-1/30 to-transparent rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 to-transparent rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="text-foreground text-lg font-medium">
                      Interactive 3D Experience
                    </div>
                    <div className="text-muted-foreground text-sm mt-2">
                      Creative Technology Visualization
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Glow Effect */}
              <div
                ref={glowEffectRef}
                className="absolute inset-0 bg-gradient-to-r from-chart-1/20 via-transparent to-chart-1/20 rounded-2xl blur-3xl -z-10"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToAbout}
            className="text-foreground hover:text-chart-1 transition-colors duration-300 p-2 rounded-full hover:bg-white/5"
            aria-label="Scroll to about section"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
