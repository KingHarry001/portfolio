import { useEffect, useState, useRef } from "react";
import { Heart, Github, Linkedin, Mail, Phone, Instagram, ExternalLink, ChevronUp, ArrowRight } from "lucide-react";

// --- Configuration ---
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

const socialPlatforms = [
  { name: "GitHub", url: socialLinks.github, icon: Github, color: "group-hover:text-white", bgColor: "hover:bg-zinc-800" },
  { name: "LinkedIn", url: socialLinks.linkedin, icon: Linkedin, color: "group-hover:text-blue-400", bgColor: "hover:bg-blue-500/10" },
  { name: "Instagram", url: socialLinks.instagram, icon: Instagram, color: "group-hover:text-pink-400", bgColor: "hover:bg-pink-500/10" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  // Typewriter State
  const roles = ["Web Developer", "Web Designer", "Cybersecurity Expert", "Founder", "Creator"];
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter Effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setText(currentRole.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentRole.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, charIndex]);

  // Intersection Observer for Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer ref={footerRef} className="relative bg-[#050505] border-t border-white/5 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{personalInfo.name}</h2>
              <div className="text-lg text-zinc-400 font-medium flex items-center gap-2 h-8">
                I'm a <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold">{text}</span>
                <span className="w-0.5 h-5 bg-cyan-400 animate-pulse"/>
              </div>
              <p className="text-zinc-500 mt-4 leading-relaxed text-sm">
                Bridging creativity with cutting-edge technology to deliver exceptional digital experiences.
              </p>
            </div>

            <div className="space-y-4">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-zinc-400 hover:text-cyan-400 transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm">{personalInfo.email}</span>
              </a>
              <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-3 text-zinc-400 hover:text-cyan-400 transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-sm">{personalInfo.phone}</span>
              </a>
            </div>

            <div className="flex gap-3">
              {socialPlatforms.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-xl bg-white/5 border border-white/5 transition-all hover:-translate-y-1 group ${social.bgColor}`}
                  aria-label={social.name}
                >
                  <social.icon size={20} className={`text-zinc-400 transition-colors ${social.color}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section, idx) => (
            <div key={section.title} className="lg:col-span-1 sm:pl-8">
              <h3 className="text-white font-bold mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-zinc-500 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-cyan-400 transition-colors" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="relative mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 to-black border border-white/10 overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay transition-opacity group-hover:opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to start?</h3>
              <p className="text-zinc-400 max-w-xl">Let's collaborate and create something amazing together.</p>
            </div>
            <button 
              onClick={(e) => handleNavClick(e, "#contact")}
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2 group/btn"
            >
              Get Started
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 animate-pulse" />
            <span>by Nexus Dynasty</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;