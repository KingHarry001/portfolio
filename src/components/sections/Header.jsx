import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, Sparkles, Command, Palette, ArrowRight, Zap,
  Mail, ExternalLink, ChevronRight, X 
} from "lucide-react";
import { 
  motion, AnimatePresence, useScroll, useSpring, 
  useMotionValue 
} from "framer-motion";
import { personalInfo } from "../../data/mock";

// --- 1. Optimized Magnetic Component ---
const Magnetic = ({ children, strength = 0.2 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// --- 2. Main Header Component ---
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredPath, setHoveredPath] = useState(location.pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const shouldBeScrolled = latest > 50;
      if (shouldBeScrolled !== isScrolled) setIsScrolled(shouldBeScrolled);
    });

    const sections = ["hero", "about", "services", "projects", "blog", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4, rootMargin: "-10% 0px -40% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [isScrolled]);

  const navItems = useMemo(() => [
    { name: "Home", href: "#hero", icon: Sparkles },
    { name: "Work", href: "#projects", icon: Zap, badge: "New" },
    { name: "Services", href: "#services", icon: Command },
    { name: "Apps", href: "/apps", icon: ExternalLink },
    { name: "Writing", href: "#blog", icon: Menu },
    { name: "Connect", href: "#contact", icon: Mail },
  ], []);

  const handleNavClick = useCallback((href) => {
    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: href } });
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(href);
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  }, [navigate, location.pathname]);

  const handleThemeToggle = () => {
    if (window.openThemeModal) window.openThemeModal();
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-chart-1 via-purple-500 to-blue-500 origin-left z-[99]"
        style={{ scaleX }}
      />

      <motion.header
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "h-16 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" 
            : "h-24 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Magnetic>
            <button 
              onClick={() => handleNavClick("#hero")}
              className="group flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-chart-1 to-blue-600 rounded-xl shadow-lg shadow-chart-1/20 group-hover:shadow-chart-1/40 transition-all duration-300 overflow-hidden">
                <span className="text-white font-black text-lg relative z-10">
                  {personalInfo.name.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </div>
              <div className="flex flex-col text-left">
                {/* FIXED: Added text-foreground for Light Mode visibility */}
                <span className="font-bold text-lg tracking-tight leading-none text-foreground group-hover:text-chart-1 transition-colors">
                  {personalInfo.name.split(" ")[0]}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                  Developer
                </span>
              </div>
            </button>
          </Magnetic>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav 
            className="hidden md:flex items-center gap-1 p-1 bg-background/50 border border-border/50 rounded-full backdrop-blur-md shadow-sm"
            onMouseLeave={() => setHoveredPath(activeSection || location.pathname)}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href || location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Magnetic key={item.name} strength={0.1}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    // FIXED: Updated text colors for Light Mode visibility
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        className="absolute inset-0 bg-foreground/10 rounded-full border border-foreground/5 shadow-inner"
                      />
                    )}
                    
                    {hoveredPath === item.href && !isActive && (
                      <motion.div
                        layoutId="nav-hover"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        className="absolute inset-0 bg-foreground/5 rounded-full"
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={14} />
                      {item.name}
                      {item.badge && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-chart-1 animate-pulse" />
                      )}
                    </span>
                  </button>
                </Magnetic>
              );
            })}
          </nav>

          {/* --- ACTIONS --- */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Magnetic>
              <button 
                onClick={handleThemeToggle}
                className="group relative p-3 rounded-xl bg-background/50 hover:bg-chart-1/20 border border-border hover:border-chart-1/50 transition-all duration-300 overflow-hidden"
              >
                <Palette size={18} className="text-muted-foreground group-hover:text-chart-1 transition-colors relative z-10" />
                <div className="absolute inset-0 bg-chart-1/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Magnetic>
            
            {/* CTA */}
            <div className="hidden md:block">
              <Magnetic>
                <button 
                  onClick={() => handleNavClick("#contact")}
                  className="group relative px-6 py-2.5 bg-foreground text-background font-bold rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Let's Talk <ArrowRight size={16} />
                  </span>
                  <div className="absolute inset-0 bg-chart-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </Magnetic>
            </div>

            {/* Mobile Menu Toggle Button (Hamburger) */}
            <button 
              className="md:hidden relative z-[60] p-2 text-foreground" // FIXED: Added text-foreground
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // FIX: Toggles properly now
            >
              <div className="w-8 flex flex-col items-end gap-1.5 group">
                {/* FIXED: Changed bg-white to bg-current so it inherits text color (Black in light mode, White in dark) */}
                <motion.span 
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8, width: 32 } : { rotate: 0, y: 0, width: 32 }}
                  className="h-0.5 bg-current block" 
                />
                <motion.span 
                  animate={isMobileMenuOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 24 }}
                  className="h-0.5 bg-current block group-hover:w-8 transition-all" 
                />
                <motion.span 
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8, width: 32 } : { rotate: 0, y: 0, width: 16 }}
                  className="h-0.5 bg-current block group-hover:w-8 transition-all" 
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-center px-6"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-chart-1/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

            {/* --- CLOSE BUTTON --- */}
            {/* Added explicit Close button inside the menu as well */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-4 text-white hover:text-chart-1 transition-colors z-50"
            >
              <X size={32} />
            </button>

            <nav className="relative z-10 space-y-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="group flex items-center gap-4 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700 hover:from-white hover:to-white transition-all duration-300 w-full"
                  >
                    <span className="text-sm font-mono text-chart-1 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      0{i + 1}
                    </span>
                    {item.name}
                    <ChevronRight className="w-8 h-8 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto" />
                  </button>
                </motion.div>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 left-6 right-6 pt-8 border-t border-white/10 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-zinc-500 text-sm uppercase tracking-widest mb-1">Get in touch</span>
                <a href={`mailto:${personalInfo.email}`} className="text-white font-bold text-lg hover:text-chart-1 transition-colors">
                  {personalInfo.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Header);