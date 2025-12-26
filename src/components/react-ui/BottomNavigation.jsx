import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronUp,
  Home,
  User,
  Briefcase,
  FileText,
  MessageSquare,
  LogIn,
  LogOut,
  Shield,
  Mail,
  Settings,
} from "lucide-react";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";

export default function BottomNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [themeColor, setThemeColor] = useState("#3b82f6"); // Default blue

  // Get current theme color - IMPROVED VERSION
  useEffect(() => {
    const getThemeColor = () => {
      const theme = document.documentElement.getAttribute("data-theme");

      // Use guaranteed visible colors based on theme
      let color = "#3b82f6"; // Default blue for light mode

      if (theme === "dark") {
        color = "#06b6d4"; // Cyan for dark mode
      } else if (theme === "glass") {
        color = "#8b5cf6"; // Purple for glass theme
      } else if (theme === "earth") {
        color = "#f97316"; // Orange for earth theme
      } else if (theme === "retro") {
        color = "#ec4899"; // Pink for retro theme
      } else if (theme === "darkblue") {
        color = "#00d4ff"; // Bright cyan for darkblue theme
      }

      console.log("🎨 Using theme color:", color, "for theme:", theme);
      setThemeColor(color);
    };

    getThemeColor();
    const observer = new MutationObserver(getThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (isSignedIn && user) {
      const isUserAdmin = user.publicMetadata?.role === "admin";
      setIsAdmin(isUserAdmin);
    }
  }, [isSignedIn, user]);

  // Scroll progress function - WORKING VERSION
  useEffect(() => {
    console.log("🔄 Setting up scroll progress...");

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const totalHeight = scrollHeight - clientHeight;
      const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;

      console.log("📊 Scroll progress:", progress.toFixed(1) + "%");
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation items for home page
  const homeSections = [
    { id: "hero", name: "Home", icon: Home, href: "#hero" },
    { id: "apps", name: "Apps Store", href: "/apps", icon: Briefcase },
    { id: "about", name: "About", icon: User, href: "#about" },
    { id: "services", name: "Services", icon: Briefcase, href: "#services" },
    { id: "projects", name: "Projects", icon: Briefcase, href: "#projects" },
    { id: "blog", name: "Blog", icon: FileText, href: "#blog" },
    {
      id: "testimonial",
      name: "Testimonials",
      icon: MessageSquare,
      href: "#testimonial",
    },
    { id: "contact", name: "Contact", icon: Mail, href: "#contact" },
  ];

  // Main navigation items
  const mainNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Apps Store", href: "/apps", icon: Briefcase },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate progress ring values - WORKING CALCULATION
  const radius = 28; // Changed from 20 to 28
  const circumference = 2 * Math.PI * radius; // ~175.93
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  // ================= DESKTOP VERSION =================
  if (!isMobile) {
    if (isSignedIn && isAdmin) {
      return (
        <>
          <div className="fixed bottom-6 left-6 z-50">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Shield className="w-6 h-6" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>

          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative w-16 h-16">
              {/* Circular Progress Ring for Desktop */}
              <svg
                className="w-full h-full transform -rotate-90 absolute inset-0"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="4"
                  fill="none"
                  className="dark:stroke-gray-700/50"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={themeColor}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    filter: `drop-shadow(0 0 6px ${themeColor}40)`,
                    transition: "stroke-dashoffset 0.15s ease-out",
                  }}
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={themeColor}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    filter: "blur(6px)",
                    opacity: "0.35",
                    transition: "stroke-dashoffset 0.15s ease-out",
                  }}
                />
              </svg>

              {/* Inner glass button with UserButton */}
              <div className="absolute inset-2.5 rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse z-10"></div>
                  {/* Glass border wrapper */}
                  <div className="p-1 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/40 dark:to-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "w-11 h-11",
                          userButtonBox: "w-full h-full",
                          userButtonTrigger: "w-full h-full p-0",
                          userButtonOuterIdentifier: "hidden",
                          avatarBox: `w-11 h-11 border-2 hover:scale-105 transition-transform`,
                          userButtonPopoverCard:
                            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl",
                          userButtonPopoverActions:
                            "border-t border-gray-200 dark:border-gray-800",
                          userButtonPopoverActionButton:
                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                        },
                        variables: {
                          colorPrimary: themeColor,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Progress percentage */}
              {scrollProgress > 5 && scrollProgress < 95 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border border-white/30 dark:border-gray-700 flex items-center justify-center shadow-sm">
                  <span
                    className="text-[8px] font-bold"
                    style={{ color: themeColor }}
                  >
                    {Math.round(scrollProgress)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else if (isSignedIn) {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative w-16 h-16">
            {/* Circular Progress Ring for Desktop */}
            <svg
              className="w-full h-full transform -rotate-90 absolute inset-0"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="4"
                fill="none"
                className="dark:stroke-gray-700/50"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={themeColor}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: `drop-shadow(0 0 6px ${themeColor}40)`,
                  transition: "stroke-dashoffset 0.15s ease-out",
                }}
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={themeColor}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: "blur(6px)",
                  opacity: "0.35",
                  transition: "stroke-dashoffset 0.15s ease-out",
                }}
              />
            </svg>

            {/* Inner glass button with UserButton */}
            <div className="absolute inset-2.5 rounded-full flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse z-10"></div>
                {/* Glass border wrapper */}
                <div className="p-1 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/40 dark:to-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "w-11 h-11",
                        userButtonBox: "w-full h-full",
                        userButtonTrigger: "w-full h-full p-0",
                        userButtonOuterIdentifier: "hidden",
                        avatarBox: `w-11 h-11 border-2 hover:scale-105 transition-transform`,
                        userButtonPopoverCard:
                          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl",
                        userButtonPopoverActions:
                          "border-t border-gray-200 dark:border-gray-800",
                        userButtonPopoverActionButton:
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                      },
                      variables: {
                        colorPrimary: themeColor,
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Progress percentage */}
            {scrollProgress > 5 && scrollProgress < 95 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border border-white/30 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span
                  className="text-[8px] font-bold"
                  style={{ color: themeColor }}
                >
                  {Math.round(scrollProgress)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative w-16 h-16">
            {/* Circular Progress Ring for Desktop */}
            <svg
              className="w-full h-full transform -rotate-90 absolute inset-0"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="4"
                fill="none"
                className="dark:stroke-gray-700/50"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={themeColor}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: `drop-shadow(0 0 6px ${themeColor}40)`,
                  transition: "stroke-dashoffset 0.15s ease-out",
                }}
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={themeColor}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: "blur(6px)",
                  opacity: "0.35",
                  transition: "stroke-dashoffset 0.15s ease-out",
                }}
              />
            </svg>

            {/* Inner glass button with User Icon */}
            <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/40 dark:to-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg flex items-center justify-center">
              <button
                onClick={() => navigate("/sign-in")}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-white/10 dark:bg-gray-800/60 hover:bg-white/20 dark:hover:bg-gray-700/60"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3337 14V12.6667C13.3337 11.9594 13.0527 11.2811 12.5526 10.781C12.0525 10.281 11.3742 10 10.667 10H5.33366C4.62641 10 3.94814 10.281 3.44804 10.781C2.94794 11.2811 2.66699 11.9594 2.66699 12.6667V14M10.667 4.66667C10.667 6.13943 9.47308 7.33333 8.00033 7.33333C6.52757 7.33333 5.33366 6.13943 5.33366 4.66667C5.33366 3.19391 6.52757 2 8.00033 2C9.47308 2 10.667 3.19391 10.667 4.66667Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </svg>
              </button>
            </div>

            {/* Progress percentage */}
            {scrollProgress > 5 && scrollProgress < 95 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border border-white/30 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <span
                  className="text-[8px] font-bold"
                  style={{ color: themeColor }}
                >
                  {Math.round(scrollProgress)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // ================= MOBILE VERSION =================
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative w-16 h-16">
          {/* WORKING PROGRESS RING - FIXED SVG */}
          <svg
            className="w-full h-full transform -rotate-90 absolute inset-0"
            viewBox="0 0 64 64"
          >
            {/* Background track */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="3"
              fill="none"
            />

            {/* PROGRESS RING - WORKING VERSION */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={themeColor}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.1s ease-out",
              }}
            />

            {/* Glow effect */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={themeColor}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: "blur(4px)",
                opacity: "0.3",
                transition: "stroke-dashoffset 0.1s ease-out",
              }}
            />
          </svg>

          {/* Inner glass button */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/40 dark:to-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg flex items-center justify-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
                isSignedIn
                  ? "bg-transparent"
                  : "bg-white/10 dark:bg-gray-800/60 hover:bg-white/20 dark:hover:bg-gray-700/60"
              }`}
              style={{
                border: isSignedIn ? `2px solid ${themeColor}80` : "none",
              }}
            >
              {isSignedIn ? (
                <div className="relative">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-300 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></div>
                  {isAdmin && (
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-purple-600 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </button>
          </div>

          {/* Progress percentage - ALWAYS VISIBLE */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 border-2 border-white/50 flex items-center justify-center shadow-lg">
            <span className="text-[9px] font-bold text-white">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 w-72 max-w-[90vw]">
            <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-white/30 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with progress visualization */}
              <div className="w-full p-4 bg-gradient-to-r from-white/20 to-white/10 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-white/20 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Scroll Progress
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: themeColor }}
                  >
                    {Math.round(scrollProgress)}%
                  </div>
                </div>

                {/* Linear progress bar */}
                <div className="w-full h-2 bg-white/20 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${scrollProgress}%`,
                      background: `linear-gradient(90deg, ${themeColor}80, ${themeColor})`,
                    }}
                  ></div>
                </div>

                {/* Scroll to top button */}
                <button
                  onClick={scrollToTop}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-white/30 dark:bg-gray-800/50 hover:bg-white/40 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                >
                  <ChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scroll to Top
                  </span>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="py-2 max-h-[60vh] overflow-y-auto">
                {pathname === "/" ? (
                  <>
                    {homeSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.href)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group"
                      >
                        <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors" />
                        <span className="text-sm flex-1">{section.name}</span>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-500 dark:group-hover:bg-gray-500 transition-colors"></div>
                      </button>
                    ))}

                    <div className="border-t border-white/20 dark:border-gray-800 mt-2 pt-2">
                      {isSignedIn ? (
                        <>
                          <button
                            onClick={() => {
                              window.Clerk?.openUserProfile();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group"
                          >
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm flex-1">
                              Manage Account
                            </span>
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => {
                                navigate("/admin");
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 p-4 hover:bg-purple-100/30 dark:hover:bg-purple-900/30 transition-all duration-200 text-left group"
                            >
                              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                              <span className="text-sm flex-1 text-purple-600 dark:text-purple-400">
                                Admin Dashboard
                              </span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              signOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-red-100/30 dark:hover:bg-red-900/20 transition-all duration-200 text-left text-red-600 dark:text-red-400 group border-t border-white/20 dark:border-gray-800 mt-2"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm flex-1">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate("/sign-in");
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group mb-2"
                          >
                            <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm flex-1">Sign In</span>
                          </button>

                          <button
                            onClick={() => scrollToSection("#contact")}
                            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg mx-2 my-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                          >
                            <Mail className="w-5 h-5" />
                            <span className="text-sm font-medium flex-1">
                              Hire Me
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {mainNavItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.href)}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group ${
                          pathname === item.href
                            ? "bg-white/20 dark:bg-gray-800"
                            : ""
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors" />
                        <span className="text-sm flex-1">{item.name}</span>
                        {pathname === item.href && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: themeColor }}
                          ></div>
                        )}
                      </button>
                    ))}

                    <div className="border-t border-white/20 dark:border-gray-800 mt-2 pt-2">
                      {isSignedIn ? (
                        <>
                          <button
                            onClick={() => {
                              window.Clerk?.openUserProfile();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group"
                          >
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm flex-1">
                              Manage Account
                            </span>
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => {
                                navigate("/admin");
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 p-4 hover:bg-purple-100/30 dark:hover:bg-purple-900/30 transition-all duration-200 text-left group"
                            >
                              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                              <span className="text-sm flex-1 text-purple-600 dark:text-purple-400">
                                Admin
                              </span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              signOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-red-100/30 dark:hover:bg-red-900/20 transition-all duration-200 text-left text-red-600 dark:text-red-400 group border-t border-white/20 dark:border-gray-800 mt-2"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm flex-1">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate("/sign-in");
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-200 text-left text-gray-800 dark:text-gray-200 group"
                          >
                            <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm flex-1">Sign In</span>
                          </button>

                          <button
                            onClick={() => navigate("/contact")}
                            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg mx-2 my-2 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                          >
                            <Mail className="w-5 h-5" />
                            <span className="text-sm font-medium flex-1">
                              Hire Me
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}