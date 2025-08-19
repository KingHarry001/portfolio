import { useEffect, useState, useRef } from "react";
import { Heart, Github, Linkedin, Mail, Phone, Instagram, ExternalLink, ChevronUp } from "lucide-react";

// Mock data (replace with your actual imports)
const personalInfo = {
  name: "Harrison King",
  email: "nexus.dynasty.org@gmail.com",
  phone: "+234 903 816 3213"
};

const socialLinks = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  instagram: "https://instagram.com/"
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const ctaRef = useRef(null);
  const sectionsRef = useRef([]);
  const heroRef = useRef(null);
  const socialRef = useRef(null);
  const bottomRef = useRef(null);

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Typewriter effect
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
      isEnd ? 2000 : deleting ? 75 : 150
    );

    return () => clearTimeout(timeout);
  }, [char, deleting, index, roles]);

  // GSAP animations
  useEffect(() => {
    // Dynamic import of GSAP (simulated)
    const initAnimations = () => {
      // Simulate GSAP timeline
      const tl = {
        fromTo: (elements, from, to, delay = 0) => {
          setTimeout(() => {
            elements.forEach((el, i) => {
              if (el) {
                Object.assign(el.style, {
                  opacity: to.opacity || 1,
                  transform: `translateY(${to.y || 0}px)`,
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                el.style.transitionDelay = `${(delay + (i * 0.1))}s`;
              }
            });
          }, 100);
        },
        from: (elements, props, delay = 0) => {
          setTimeout(() => {
            elements.forEach((el, i) => {
              if (el) {
                Object.assign(el.style, {
                  opacity: props.opacity || 1,
                  transform: `translateY(${props.y || 0}px) scale(${props.scale || 1})`,
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                });
                el.style.transitionDelay = `${(delay + (i * 0.15))}s`;
              }
            });
          }, 200);
        }
      };

      // Animate hero section
      if (heroRef.current) {
        tl.fromTo([heroRef.current], { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0);
      }

      // Animate footer sections
      const sections = sectionsRef.current.filter(Boolean);
      if (sections.length) {
        tl.fromTo(sections, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.2);
      }

      // Animate social links
      if (socialRef.current) {
        const socialButtons = socialRef.current.querySelectorAll('a');
        tl.from(Array.from(socialButtons), { scale: 0, opacity: 0 }, 0.6);
      }

      // Animate CTA
      if (ctaRef.current) {
        tl.fromTo([ctaRef.current], { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.8);
      }

      // Animate bottom section
      if (bottomRef.current) {
        tl.fromTo([bottomRef.current], { opacity: 0 }, { opacity: 1 }, 1);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            initAnimations();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Graphic Design", href: "#services" },
        { name: "Web Development", href: "#services" },
        { name: "UI/UX Design", href: "#services" },
        { name: "Security Consulting", href: "#services" },
      ],
    },
    {
      title: "Projects",
      links: [
        { name: "Featured Work", href: "#projects" },
        { name: "Design Portfolio", href: "#projects" },
        { name: "Development Projects", href: "#projects" },
        { name: "Security Tools", href: "#projects" },
      ],
    },
    {
      title: "Learning",
      links: [
        { name: "Blog Articles", href: "#blog" },
        { name: "Cybersecurity", href: "#blog" },
        { name: "Web3 & Crypto", href: "#blog" },
        { name: "Development Tips", href: "#blog" },
      ],
    },
  ];

  const handleQuickHire = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialPlatforms = [
    { 
      name: "GitHub", 
      url: socialLinks.github, 
      icon: Github, 
      color: "hover:text-gray-300",
      bgColor: "hover:bg-gray-800/20"
    },
    { 
      name: "LinkedIn", 
      url: socialLinks.linkedin, 
      icon: Linkedin, 
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-500/20"
    },
    { 
      name: "Instagram", 
      url: socialLinks.instagram, 
      icon: Instagram, 
      color: "hover:text-pink-400",
      bgColor: "hover:bg-pink-500/20"
    }
  ];

  return (
    <>
      <footer ref={footerRef} className="bg-muted border-t border-border/50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-chart-2/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand & Description */}
            <div ref={heroRef} className="lg:col-span-1 space-y-6 opacity-0">
              <div>
                <h3 className="text-2xl font-bold  mb-2 bg-gradient-to-r from-chart-1 to-gray-300 bg-clip-text text-transparent">
                  {personalInfo.name}
                </h3>
                <h2 className="relative text-left text-xl text-muted-foreground font-medium mb-4">
                  I'm a{" "}
                  <span className="font-bold bg-gradient-to-r from-[#9c43fe] via-[#4cc2e9] to-[#1014cc] bg-clip-text text-transparent">
                    {text}
                  </span>
                  <span className="text-chart-1 animate-pulse ml-1">|</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Bridging creativity with cutting-edge technology to deliver
                  exceptional digital experiences.
                </p>
              </div>

              {/* Quick Contact */}
              <div className="space-y-3">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all duration-300 group"
                >
                  <div className="p-2 bg-chart-1/10 rounded-lg group-hover:bg-chart-1/20 transition-colors duration-300">
                    <Mail size={16} className="text-chart-1" />
                  </div>
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                    {personalInfo.email}
                  </span>
                </a>
                <a 
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all duration-300 group"
                >
                  <div className="p-2 bg-chart-1/10 rounded-lg group-hover:bg-chart-1/20 transition-colors duration-300">
                    <Phone size={16} className="text-chart-1" />
                  </div>
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                    {personalInfo.phone}
                  </span>
                </a>
              </div>

              {/* Social Links */}
              <div ref={socialRef} className="flex gap-4">
                {socialPlatforms.map((platform, index) => {
                  const IconComponent = platform.icon;
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group p-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-300 hover:border-chart-1/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-chart-1/20 ${platform.bgColor}`}
                      title={platform.name}
                      style={{ transform: 'scale(0)', opacity: 0 }}
                    >
                      <IconComponent
                        size={20}
                        className={`text-muted-foreground transition-all duration-300 group-hover:scale-110 ${platform.color}`}
                      />
                      <ExternalLink 
                        size={12} 
                        className="absolute -top-1 -right-1 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            {footerSections.map((section, index) => (
              <div
                key={index}
                ref={(el) => (sectionsRef.current[index] = el)}
                className="opacity-0 sm:ml-12"
              >
                <h4 className="text-foreground font-semibold mb-6 text-lg relative">
                  {section.title}
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-chart-1 to-transparent"></div>
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="text-muted-foreground hover:text-chart-1 transition-all duration-300 hover:translate-x-2 flex items-center gap-2 group text-left"
                      >
                        <span className="w-1 h-1 bg-chart-1/50 rounded-full group-hover:bg-chart-1 transition-colors duration-300"></span>
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Hire CTA */}
          <div ref={ctaRef} className="mt-16 pt-8 border-t border-border/50 opacity-0">
            <div className="bg-gradient-to-r from-chart-1/10 via-chart-2/5 to-transparent border border-chart-1/20 rounded-2xl p-8 text-center backdrop-blur-sm relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-chart-2/20 rounded-full blur-lg animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Ready to Start Your Project?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Let's collaborate and create something amazing together. From
                  concept to completion, I'm here to bring your digital vision to
                  life.
                </p>
                <button
                  onClick={handleQuickHire}
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/80 hover:to-chart-2/80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-chart-1/25 group"
                >
                  Get Started Today
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div ref={bottomRef} className="border-t border-border/50 bg-background/50 backdrop-blur-sm opacity-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-[10vh] sm:pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>
                  © {currentYear} {personalInfo.name}. All rights reserved.
                </span>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <button
                  onClick={() => alert("Privacy Policy would be displayed here")}
                  className="hover:text-chart-1 transition-colors duration-300 relative group"
                >
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-chart-1 group-hover:w-full transition-all duration-300"></span>
                </button>
                <button
                  onClick={() => alert("Terms of Service would be displayed here")}
                  className="hover:text-chart-1 transition-colors duration-300 relative group"
                >
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-chart-1 group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm max-[456px]:text-center">
                <span className="flex items-center gap-2">
                  Made with
                  <Heart
                    size={16}
                    className="text-red-500 animate-pulse"
                  />
                  by Nexus Dynasty Studio
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-chart-1 hover:bg-chart-1/80 text-white rounded-full shadow-lg hover:shadow-chart-1/25 transition-all duration-300 hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <ChevronUp 
            size={20} 
            className="group-hover:-translate-y-1 transition-transform duration-300" 
          />
        </button>
      )}
    </>
  );
};

export default Footer;