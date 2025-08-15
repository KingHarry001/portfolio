import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { personalInfo } from "../data/mock";
import ThemeToggle from "./react-ui/ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    {
      name: "Services",
      href: "#services",
      children: [
        { name: "Graphics", href: "/graphic-design" },
        { name: "Web Development", href: "/web-development" },
        { name: "UI/UX Design", href: "/uiux-design" },
        { name: "Security Consulting", href: "/security-consulting" },
      ],
    },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blog" },
    { name: "Testimonials", href: "#testimonial" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { state: { scrollTo: href } });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const target = document.querySelector(location.state.scrollTo);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-background text-foreground backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span
              className="text-2xl font-bold text-foreground hover:text-chart-1 transition-colors duration-300 cursor-pointer"
              onClick={() => scrollToSection("#hero")}
            >
              {personalInfo.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative flex items-center gap-1"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.name)
                }
                onMouseLeave={() =>
                  item.children && setTimeout(() => setOpenDropdown(null), 2000)
                }
              >
                {/* Click name to navigate */}
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
                {/* Click arrow to toggle dropdown */}
                {item.children && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === item.name ? null : item.name
                      );
                    }}
                    className="text-xs cursor-pointer"
                  >
                    &#9662;
                  </span>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.name && (
                  <div
                    className="absolute bg-background border border-white/10 rounded-lg shadow-lg top-full left-0 mt-2 min-w-[180px] z-50"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <button
                        key={child.name}
                        onClick={() => scrollToSection(child.href)}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background text-foreground backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center">
                    {/* Text click navigates */}
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="flex-1 text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-md transition-all duration-300"
                    >
                      {item.name}
                    </button>
                    {/* Arrow toggles */}
                    {item.children && (
                      <span
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.name ? null : item.name
                          )
                        }
                        className="px-2 cursor-pointer"
                      >
                        {openDropdown === item.name ? "▲" : "▼"}
                      </span>
                    )}
                  </div>

                  {/* Dropdown */}
                  {item.children && openDropdown === item.name && (
                    <div className="pl-6">
                      {item.children.map((child) => (
                        <button
                          key={child.name}
                          onClick={() => scrollToSection(child.href)}
                          className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-md transition-all duration-300"
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
