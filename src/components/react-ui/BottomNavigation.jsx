import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronUp,
  Home,
  User,
  Briefcase,
  FileText,
  LogIn,
  LogOut,
  Shield,
  Mail,
  Zap,
  LayoutGrid,
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
  const [themeColor, setThemeColor] = useState("#3b82f6");

  // Haptics helper
  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // --- LOGIC SECTION ---

  // 1. Detect Theme Color
  useEffect(() => {
    const getThemeColor = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      const colors = {
        light: "#3b82f6",
        dark: "#06b6d4",
        glass: "#8b5cf6",
        earth: "#f97316",
        retro: "#ec4899",
        darkblue: "#00d4ff",
      };
      setThemeColor(colors[theme] || "#3b82f6");
    };
    getThemeColor();
    const observer = new MutationObserver(getThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // 2. Check Admin Status
  useEffect(() => {
    if (isSignedIn && user) {
      const isUserAdmin = user.publicMetadata?.role === "admin";
      setIsAdmin(isUserAdmin);
    }
  }, [isSignedIn, user]);

  // 3. Scroll Progress (Clamped)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalHeight = scrollHeight - clientHeight;
      
      // Prevent rubber-banding values (<0 or >100)
      let progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
      progress = Math.min(100, Math.max(0, progress));
      
      setScrollProgress(progress);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Mobile Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (href) => {
    triggerHaptic();
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    triggerHaptic();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // --- NAVIGATION DATA ---
  const homeSections = [
    { id: "hero", name: "Home", icon: Home, href: "#hero", color: "text-blue-500" },
    { id: "apps", name: "App Store", href: "/apps", icon: LayoutGrid, color: "text-purple-500" },
    { id: "projects", name: "Projects", icon: Zap, href: "#projects", color: "text-amber-500" },
    { id: "about", name: "About", icon: User, href: "#about", color: "text-emerald-500" },
    { id: "blog", name: "Blog", icon: FileText, href: "#blog", color: "text-pink-500" },
    { id: "contact", name: "Contact", icon: Mail, href: "#contact", color: "text-cyan-500" },
  ];

  const mainNavItems = [
    { name: "Home", href: "/", icon: Home, color: "text-blue-500" },
    { name: "Apps Store", href: "/apps", icon: LayoutGrid, color: "text-purple-500" },
    { name: "Blog", href: "/blog", icon: FileText, color: "text-pink-500" },
    { name: "Contact", href: "#contact", icon: Mail, color: "text-cyan-500" },
  ];

  // ================= UI COMPONENTS =================

  const ProgressRingButton = ({ onClick, children }) => (
    <div className="relative w-16 h-16 group cursor-pointer" onClick={onClick}>
      {/* 1. Ambient Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-opacity duration-700"
        style={{ backgroundColor: themeColor }}
      />

      {/* 2. The SVG Ring */}
      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColor} stopOpacity="0" />
            <stop offset="100%" stopColor={themeColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        <circle
          cx="32" cy="32" r="28"
          stroke="currentColor" strokeWidth="3" fill="none"
          className="text-white/10 dark:text-white/5"
        />
        
        <circle
          cx="32" cy="32" r="28"
          stroke="url(#cometGradient)" strokeWidth="3" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      {/* 3. The Physical Glass Button */}
      <div className="absolute inset-2 z-20 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-0 bg-noise opacity-[0.08] pointer-events-none" />
        <div className="w-full h-full bg-white/10 dark:bg-black/40 backdrop-blur-xl flex items-center justify-center relative">
          {children}
        </div>
      </div>

      {/* 4. Percentage Pill */}
      {scrollProgress > 2 && (
        <div className="absolute -top-1 -right-1 z-30 animate-in fade-in zoom-in duration-300">
          <div className="px-1.5 py-0.5 rounded-full bg-[#0a0a0a] border border-white/20 shadow-lg flex items-center justify-center min-w-[24px]">
            <span className="text-[9px] font-bold text-white font-mono tracking-tighter">
              {Math.round(scrollProgress)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // ================= DESKTOP RENDER =================
  if (!isMobile) {
    return (
      <>
        {/* Admin Float Button */}
        {isSignedIn && isAdmin && (
          <div className="fixed bottom-8 left-8 z-[100] animate-fade-in-up">
            <button
              onClick={() => handleNavigate("/admin")}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield className="w-4 h-4 text-white dark:text-black relative z-10" />
              <span className="text-sm font-bold tracking-wide text-white dark:text-black relative z-10">Admin</span>
            </button>
          </div>
        )}

        {/* Desktop Progress/Auth Trigger */}
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
          <ProgressRingButton onClick={isSignedIn ? () => {} : () => handleNavigate('/sign-in')}>
             {isSignedIn ? (
                <div className="w-full h-full rounded-full overflow-hidden p-[2px]">
                   <UserButton 
                      appearance={{
                        elements: {
                          rootBox: "w-full h-full",
                          userButtonTrigger: "w-full h-full opacity-0 cursor-pointer",
                          avatarBox: "w-full h-full"
                        }
                      }}
                   />
                   <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none p-[2px]">
                      <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                   </div>
                </div>
             ) : (
                <LogIn className="w-5 h-5 text-white dark:text-white" />
             )}
          </ProgressRingButton>
        </div>
      </>
    );
  }

  // ================= MOBILE RENDER =================
  
  // Animation Logic: Profile Pic = Subtle Scale; Menu Icon = Rotate + Scale
  const triggerTransformClass = isSignedIn 
    ? (isMobileMenuOpen ? "scale-95" : "scale-100") 
    : (isMobileMenuOpen ? "rotate-90 scale-90" : "rotate-0 scale-100");

  return (
    <>
      {/* --- Main Floating Trigger --- */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[50] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <ProgressRingButton onClick={() => { triggerHaptic(); setIsMobileMenuOpen(!isMobileMenuOpen); }}>
           <div className={`transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${triggerTransformClass}`}>
              {isSignedIn ? (
                 <img 
                   src={user?.imageUrl} 
                   alt="Me" 
                   className="w-full h-full rounded-full object-cover ring-2 transition-all duration-300" 
                   style={{ ringColor: isMobileMenuOpen ? themeColor : 'transparent', borderColor: 'transparent' }}
                 />
              ) : (
                 isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />
              )}
           </div>
        </ProgressRingButton>
      </div>

      {/* --- Mobile Control Center --- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Floating Dock */}
          <div className="fixed bottom-28 left-4 right-4 z-50 flex flex-col items-center justify-end pointer-events-none">
            <div className="w-full max-w-[360px] pointer-events-auto animate-spring-up origin-bottom">
              
              {/* Premium Glass Container */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10">
                {/* Background Layer */}
                <div className="absolute inset-0 bg-[#f5f5f7]/90 dark:bg-[#121212]/90 backdrop-blur-2xl z-0" />
                <div className="absolute inset-0 bg-noise opacity-[0.03] z-0 pointer-events-none" />
                
                <div className="relative z-10">
                  {/* 1. Header & Stats */}
                  <div className="px-6 py-5 border-b border-gray-200/50 dark:border-white/5">
                     <div className="flex justify-between items-end mb-4">
                        <div>
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Menu</h3>
                           <div className="flex items-center gap-1.5 mt-1">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: themeColor }}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: themeColor }}></span>
                              </span>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Online</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-3xl font-black tracking-tighter" style={{ color: themeColor }}>
                              {Math.round(scrollProgress)}<span className="text-sm text-gray-400 font-bold ml-0.5">%</span>
                           </span>
                        </div>
                     </div>
                     
                     {/* Glossy Progress Bar */}
                     <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full relative overflow-hidden transition-all duration-300"
                          style={{ width: `${scrollProgress}%`, backgroundColor: themeColor }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shimmer" />
                        </div>
                     </div>
                  </div>

                  {/* 2. Grid Navigation */}
                  <div className="p-3 max-h-[40vh] overflow-y-auto no-scrollbar">
                     <div className="grid grid-cols-2 gap-3">
                        {(pathname === "/" ? homeSections : mainNavItems).map((item, idx) => (
                           <button
                              key={item.name}
                              onClick={() => handleNavigate(item.href)}
                              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-transparent transition-all duration-200 bg-white dark:bg-white/5 shadow-sm hover:shadow-md active:scale-95 overflow-hidden"
                              style={{ animationDelay: `${idx * 50}ms` }}
                           >
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current" style={{ color: themeColor }} />
                              
                              <item.icon 
                                 className={`w-7 h-7 mb-2 transition-transform duration-300 group-hover:-translate-y-1 ${item.color}`} 
                                 strokeWidth={1.5}
                              />
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{item.name}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* 3. Footer Actions */}
                  <div className="p-4 bg-gray-50/80 dark:bg-black/20 border-t border-gray-200/50 dark:border-white/5 space-y-3">
                     {isSignedIn ? (
                        <div className="flex gap-3">
                           {/* Profile Button */}
                           <button 
                              onClick={() => window.Clerk?.openUserProfile()}
                              className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all"
                           >
                              <User className="w-4 h-4 text-gray-900 dark:text-white" />
                              <span className="text-sm font-bold text-gray-900 dark:text-white">Profile</span>
                           </button>
                           
                           {/* Admin Button */}
                           {isAdmin && (
                              <button 
                                 onClick={() => handleNavigate("/admin")}
                                 className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 active:scale-95 transition-all"
                              >
                                 <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </button>
                           )}
                           
                           {/* Sign Out */}
                           <button 
                              onClick={() => signOut()}
                              className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 active:scale-95 transition-all"
                           >
                              <LogOut className="w-4 h-4 text-red-500" />
                           </button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-3">
                           {/* HIRE ME BUTTON (Primary) */}
                           <button 
                              onClick={() => handleNavigate("#contact")}
                              className="relative overflow-hidden rounded-2xl py-3.5 font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                              
                              <Mail className="w-4 h-4 relative z-10" />
                              <span className="relative z-10 text-sm">Hire Me</span>
                           </button>

                           {/* SIGN IN BUTTON (Secondary) */}
                           <button 
                              onClick={() => handleNavigate("/sign-in")}
                              className="relative overflow-hidden rounded-2xl py-3.5 font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                              style={{ backgroundColor: themeColor }}
                           >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                              <LogIn className="w-4 h-4" />
                              <span className="text-sm">Sign In</span>
                           </button>
                        </div>
                     )}

                     <button
                        onClick={scrollToTop}
                        className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                     >
                        <ChevronUp className="w-3 h-3" />
                        Back to Top
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes spring-up {
           0% { transform: translateY(120px) scale(0.9); opacity: 0; }
           50% { transform: translateY(-8px) scale(1.02); opacity: 1; }
           100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-spring-up { animation: spring-up 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        
        @keyframes fade-in {
           from { opacity: 0; }
           to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        @keyframes fade-in-up {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}