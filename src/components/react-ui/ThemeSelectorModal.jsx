'use client'
import { useState, useEffect } from "react";
import { Sun, Moon, Sparkles, Palette, Earth, Clock, X } from "lucide-react";

const themes = [
  { id: "light", name: "Light Mode", icon: Sun, color: "text-yellow-500", description: "Classic light mode" },
  { id: "dark", name: "Dark Mode", icon: Moon, color: "text-blue-400", description: "Dark background with blue accents" },
  { id: "earth", name: "Earth Mode", icon: Earth, color: "text-green-500", description: "Natural green tones" },
  { id: "glass", name: "Glass Mode", icon: Sparkles, color: "text-cyan-300", description: "Glassmorphism effects" },
  { id: "retro", name: "Retro Mode", icon: Clock, color: "text-pink-500", description: "80s inspired theme" },
];

const ThemeSelectorModal = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    // Remove all theme classes
    html.classList.remove("light", "dark", "earth", "glass", "retro");
    // Add selected theme class
    html.classList.add(newTheme);
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    // Close modal after a short delay so user can see the selection
    setTimeout(() => {
      handleClose();
    }, 400);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Higher z-index than header */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 9998 }}
        onClick={handleClose}
      />
      
      {/* Modal Container - Fixed at bottom with highest z-index */}
      <div 
        className="fixed inset-x-0 bottom-0 flex justify-center items-end pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className={`w-full max-w-md mb-0 md:mb-6 pointer-events-auto transition-all duration-300 ease-out ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          {/* Modal Card */}
          <div className="bg-background border-t md:border border-border md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[hsl(var(--chart-1))]/10">
                  <Palette className={`w-6 h-6 ${themes.find(t => t.id === theme)?.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Choose Theme
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred appearance
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl transition-all hover:bg-muted hover:scale-110 active:scale-95"
                aria-label="Close theme selector"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Theme Options */}
            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto bg-background">
              {themes.map((t, index) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;
                
                return (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? `border-2 border-[hsl(var(--chart-1))] shadow-lg bg-[hsl(var(--chart-1))]/10 scale-[1.02]`
                        : `border-2 border-border hover:border-[hsl(var(--chart-1))]/30 hover:bg-muted hover:scale-[1.01] active:scale-[0.99]`
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isAnimating ? 'slideInUp 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    {/* Icon Container */}
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[hsl(var(--chart-1))]/20 shadow-md' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${t.color} ${isSelected ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 text-left">
                      <p className={`font-semibold text-foreground mb-1 ${isSelected ? 'text-[hsl(var(--chart-1))]' : ''}`}>
                        {t.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className="flex items-center">
                      {isSelected ? (
                        <div className="p-2 rounded-full bg-[hsl(var(--chart-1))] shadow-lg animate-scale-in">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-border transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with gradient */}
            <div className="px-6 py-4 bg-card border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Theme will be saved automatically
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ThemeSelectorModal;