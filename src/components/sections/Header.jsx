import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { personalInfo } from "../../data/mock";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only update active section on home page
      if (location.pathname === "/") {
        const sections = [
          "hero",
          "about",
          "services",
          "projects",
          "blog",
          "testimonial",
          "contact",
        ];
        let currentSection = "";

        // Check sections from bottom to top to handle overlapping
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const element = document.querySelector(`#${section}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const threshold = window.innerHeight * 0.3; // 30% of viewport

            if (rect.top <= threshold) {
              currentSection = `#${section}`;
              break;
            }
          }
        }

        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [location.pathname, activeSection]);

  // Set initial active section
  useEffect(() => {
    if (location.pathname === "/") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const hash = location.hash || "#hero";
        setActiveSection(hash);
      }, 100);
    } else {
      setActiveSection(location.pathname);
    }
  }, [location.pathname, location.hash]);

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Apps", href: "/apps" },
    {
      name: "Services",
      href: "#services",
    },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blog" },
    { name: "Testimonials", href: "#testimonial" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith("#")) {
      if (location.pathname === "/") {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Update active section immediately for better UX
          setActiveSection(href);
        }
      } else {
        navigate("/", { state: { scrollTo: href } });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const target = document.querySelector(location.state.scrollTo);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
          setActiveSection(location.state.scrollTo);
        }, 100);
      }
    }
  }, [location]);

  // Check if item is active
  const isActive = (item) => {
    if (item.children) {
      // Only highlight parent if we're actually on a child route, not on home page sections
      return item.children.some((child) => child.href === location.pathname);
    }

    if (item.href.startsWith("#")) {
      return location.pathname === "/" && activeSection === item.href;
    } else {
      return location.pathname === item.href;
    }
  };

  const isChildActive = (child) => {
    return location.pathname === child.href;
  };

  // Function to open theme modal using global state
  const handleOpenThemeModal = () => {
    if (typeof window !== 'undefined' && window.openThemeModal) {
      window.openThemeModal();
    }
  };

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-background/90 text-foreground backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
      style={{ zIndex: 40 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/admin"
              className="text-2xl font-bold text-foreground hover:text-chart-1 transition-all duration-300 cursor-pointer hover:scale-105 transform"
              // onClick={(e) => {
              //   e.preventDefault();
              //   scrollToSection("#hero");
              // }}
            >
              {personalInfo.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative flex items-center gap-1"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() =>
                  item.children && setTimeout(() => setOpenDropdown(null), 300)
                }
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`font-medium transition-all duration-300 ease-out relative py-2 px-1 group ${
                    isActive(item)
                      ? "text-chart-1 transform scale-105"
                      : "text-muted-foreground hover:text-foreground hover:scale-105"
                  }`}
                >
                  {item.name}

                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-chart-1 rounded-full transition-all duration-300 ease-out ${
                      isActive(item)
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                    }`}
                  ></span>
                </button>

                {item.children && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === item.name ? null : item.name
                      );
                    }}
                    className={`text-xs cursor-pointer transition-all duration-300 ease-out transform hover:scale-110 ${
                      isActive(item)
                        ? "text-chart-1 rotate-180"
                        : openDropdown === item.name
                        ? "text-foreground rotate-180"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    &#9662;
                  </span>
                )}

                {/* Animated Dropdown */}
                {item.children && (
                  <div
                    className={`absolute bg-background/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl top-full left-0 mt-3 min-w-[200px] overflow-hidden transition-all duration-300 ease-out transform origin-top ${
                      openDropdown === item.name
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                    style={{ zIndex: 50 }}
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map((child, index) => (
                      <button
                        key={child.name}
                        onClick={() => scrollToSection(child.href)}
                        className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 ease-out transform hover:scale-[1.02] ${
                          isChildActive(child)
                            ? "text-chart-1 bg-chart-1/20 shadow-inner"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation:
                            openDropdown === item.name
                              ? `slideInFromTop 0.3s ease-out forwards`
                              : "none",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          {child.name}
                          {isChildActive(child) && (
                            <span className="w-2 h-2 bg-chart-1 rounded-full"></span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme selector button */}
            <button 
              onClick={handleOpenThemeModal}
              className="p-2 rounded-lg hover:bg-muted transition-colors group"
              aria-label="Open theme selector"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="text-foreground group-hover:scale-110 transition-transform"
                viewBox="0 0 16 16"
              >
                <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </button>

            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
            >
              <div
                className={`transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-foreground" />
                ) : (
                  <Menu size={20} className="text-foreground" />
                )}
              </div>
            </button> */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {/* <div
          className={`md:hidden bg-background/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <div
                key={item.name}
                className={`transition-all duration-300 ease-out transform ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`flex-1 text-left px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden ${
                      isActive(item)
                        ? "text-chart-1 bg-gradient-to-r from-chart-1/20 to-chart-1/10 shadow-inner"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                    {isActive(item) && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-chart-1 rounded-r-full"></span>
                    )}
                  </button>

                  {item.children && (
                    <span
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.name ? null : item.name
                        )
                      }
                      className={`px-3 py-2 cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                        openDropdown === item.name ? "rotate-180" : ""
                      } ${
                        isActive(item)
                          ? "text-chart-1"
                          : "text-muted-foreground"
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </div>

                Mobile Dropdown
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    item.children && openDropdown === item.name
                      ? "max-h-64 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-6 pt-1">
                    {item.children?.map((child, childIndex) => (
                      <button
                        key={child.name}
                        onClick={() => scrollToSection(child.href)}
                        className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] relative ${
                          isChildActive(child)
                            ? "text-chart-1 bg-chart-1/20 shadow-inner"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                        }`}
                        style={{
                          animationDelay: `${childIndex * 100}ms`,
                          transform:
                            openDropdown === item.name
                              ? "translateX(0)"
                              : "translateX(-10px)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          {child.name}
                          {isChildActive(child) && (
                            <span className="w-2 h-2 bg-chart-1 rounded-full"></span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;