import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import { personalInfo } from "../data/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = personalInfo.tagline;

  const statsRef = useRef();
  const sectionRef = useRef();
  
  useEffect(() => {
    if (!statsRef.current) return;

    const statEls = gsap.utils.selector(statsRef)(".stats-value");

    statEls.forEach((el) => {
      const finalValue = parseInt(el.textContent.replace(/[^0-9]/g, ""));
      const suffix = el.textContent.replace(/[0-9]/g, "");
      const obj = { value: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reset",
        onEnter: () => {
          gsap.to(obj, {
            value: finalValue,
            duration: 4,
            ease: "power2.out",
            onUpdate: () => {
              el.innerText =
                new Intl.NumberFormat().format(Math.floor(obj.value)) + suffix;
            },
          });
        },
      });
    });

    // Cleanup triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fileDownloadURL =
    "https://drive.google.com/uc?export=download&id=1Gi4LJY5ZaEzsHm1O_FPusCb7mb-TSyLN";

  const handleResumeDownload = () => {
    window.open(fileDownloadURL, "_blank");
  };

  const roles = [
    "Web Developer",
    "Web Designer",
    "Cybersecurity Expert",
    "Founder",
    "Creator",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index];
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
            setIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isEnd ? 1000 : deleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [char, deleting, index]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl px-4 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 chart-1/10 border border-[#00FFD1]/20 rounded-full">
                <div className="w-2 h-2 chart-1 rounded-full animate-pulse mr-3"></div>
                <span className="text-chart-1 text-sm font-medium">
                  Available for new projects
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>

              <div className="my-8">
                <h2 className="relative text-left text-xl lg:text-2xl text-muted-foreground font-medium">
                  I'm a <span className="cursor-target"> </span>
                  <span className="font-bold animate-pulse bg-gradient-to-r from-[#9c43fe] via-[#4cc2e9] to-[#1014cc] bg-clip-text text-transparent">
                    {text}
                  </span>
                  <span className="text-foreground animate-blink">|</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {personalInfo.bio}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToAbout()}
                className="btn-primary group flex items-center justify-center gap-3 bg-chart-1"
              >
                <span>View My Work</span>
                <ExternalLink
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>

              <button
                onClick={handleResumeDownload}
                className="btn-secondary ring-2 ring-ring group flex items-center justify-center gap-3"
              >
                <Download
                  size={18}
                  className="group-hover:-translate-y-1 transition-transform duration-300"
                />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10"
            >
              <div>
                <div className="text-2xl font-bold text-foreground stats-value">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground stats-value">
                  3+
                </div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground stats-value">
                  25+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - 3D Spline Scene */}
          <div className="relative h-[700px] flex items-center justify-center">
            <div className="w-full h-full max-w-[700px] overflow-visible relative">
              {/* Placeholder for 3D Scene */}
              <div className="w-full h-full bg-gradient-to-br from-chart-1/20 via-black to-transparent rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-chart-1/30 to-transparent rounded-full animate-pulse mb-8 mx-auto"></div>
                  <div className="text-foreground text-lg font-medium">
                    Interactive 3D Experience
                  </div>
                  <div className="text-muted-foreground text-sm mt-2">
                    Creative Technology Visualization
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 via-transparent to-[#00FFD1]/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToAbout}
            className="text-foreground hover:text-foreground transition-colors duration-300"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
