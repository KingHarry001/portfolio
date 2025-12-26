import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ChevronDown, Download, ExternalLink, Mail, MapPin, Briefcase } from "lucide-react";
import { personalInfo } from "../../data/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { resumesAPI } from "../../api/supabase";
import King from "../../assets/King.png";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const [activeResume, setActiveResume] = useState(null);
  
  // Refs
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const bioRef = useRef(null);
  const ctaRef = useRef(null);
  const footerRef = useRef(null);

  // Fetch Resume
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

  const handleResumeDownload = useCallback(() => {
    if (activeResume?.file_url) {
      window.open(activeResume.file_url, "_blank");
    }
  }, [activeResume]);

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial States
      gsap.set([badgeRef.current, nameRef.current, roleRef.current, bioRef.current, ctaRef.current, footerRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        x: 50,
        scale: 0.95,
      });

      // Main Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(nameRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.6")
        .to(roleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
        .to(bioRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(footerRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(imageRef.current, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "power2.out" }, "-=1.2");

      // Parallax Effect on Scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(imageRef.current, {
            y: 50 * self.progress,
            ease: "none",
            duration: 0.1,
          });
          gsap.to(contentRef.current, {
            y: -30 * self.progress,
            ease: "none",
            duration: 0.1,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden flex flex-col justify-center pt-24 pb-12 lg:pt-32 lg:pb-0"
    >
      {/* Background Decor (Subtle & Premium) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-chart-1/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-1/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full h-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start h-full">
          
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center h-full space-y-8 lg:space-y-10">
            
            {/* Availability Badge */}
            <div ref={badgeRef} className="flex items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-1/10 border border-chart-1/20 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide text-foreground/80 uppercase">
                  Available for new projects
                </span>
              </div>
            </div>

            {/* Name & Headline */}
            <div className="space-y-2">
              <h2 ref={nameRef} className="text-lg font-medium text-chart-1 tracking-widest uppercase mb-2">
                I am {" "} {personalInfo.name}
              </h2>
              <h1 ref={roleRef} className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.9]">
                Full Stack <br />
                <span className="text-muted-foreground/40">Engineer.</span>
              </h1>
            </div>

            {/* Bio */}
            <p ref={bioRef} className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {personalInfo.tagline}. I build scalable, impact-driven platforms with a focus on performance and user experience. Expert in Next.js, Node.js, and modern UI/UX.
            </p>

            {/* CTA Actions */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={scrollToContact}
                className="group relative px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Contact Me <Mail className="w-5 h-5" />
                </span>
              </button>

              {activeResume && (
                <button
                  onClick={handleResumeDownload}
                  className="group px-8 py-4 bg-transparent border border-border rounded-full font-semibold text-lg hover:bg-muted/50 transition-all hover:border-foreground/50 flex items-center gap-2"
                >
                  <span>Download CV</span>
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Footer Stats / Info */}
            <div ref={footerRef} className="pt-12 lg:pt-20 border-t border-border/40 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-medium">
                    <MapPin className="w-4 h-4" /> Based In
                  </div>
                  <p className="text-foreground font-semibold">Lagos, Nigeria</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-medium">
                    <Briefcase className="w-4 h-4" /> Experience
                  </div>
                  <p className="text-foreground font-semibold">5+ Years</p>
                </div>
                <div className="space-y-1 hidden sm:block">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-medium">
                    <ExternalLink className="w-4 h-4" /> Current Role
                  </div>
                  <p className="text-foreground font-semibold">Founder @ TaskMaster</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: IMAGE --- */}
          <div className="lg:col-span-5 h-full flex items-center justify-center lg:justify-end relative mt-12 lg:mt-0">
            {/* Image Container Card */}
            <div 
              ref={imageRef}
              className="relative w-full max-w-md lg:max-w-full aspect-[4/5] lg:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-muted group"
            >
              {/* Actual Image (Replace placeholder with your image) */}
              <img 
                src={King}
                alt="Profile" 
                className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Floating Badge on Image */}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Open to Work
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Latest Project</p>
                  <h3 className="text-white text-xl font-bold">TaskMaster Pro</h3>
                  <div className="flex items-center gap-2 mt-4 text-white/90 text-sm font-medium cursor-pointer hover:text-white transition-colors">
                    View Case Study <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements behind image */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-chart-1/20 rounded-[2rem] hidden lg:block" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;