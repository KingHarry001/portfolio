import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles, Earth, Clock } from "lucide-react";

const themes = [
  { id: "light", name: "Light Mode", color: "text-yellow-500", icon: Sun },
  { id: "dark", name: "Dark Mode", color: "text-blue-400", icon: Moon },
  { id: "earth", name: "Earth", color: "text-green-500", icon: Earth },
  { id: "glass", name: "Glass Mode", color: "text-cyan-300", icon: Sparkles },
  { id: "retro", name: "Retro", color: "text-pink-500", icon: Clock },
];

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Apply theme classes to html
    root.classList.remove("light", "dark", "glass", "earth", "retro");
    root.classList.add(theme);
  }, [theme]);

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  const PaletteIcon = ({
    className = "",
    glowing = false,
    themeColor = "text-yellow-500",
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      className={`${className} ${
        glowing
          ? `${themeColor} filter drop-shadow-[0_0_6px_currentColor] transition-all duration-300`
          : "text-gray-600 dark:text-gray-400"
      }`}
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </svg>
  );

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors group"
        aria-label="Change theme"
      >
        <div className="relative">
          <PaletteIcon
            className="group-hover:scale-110 transition-transform"
            glowing={true}
            themeColor={currentTheme.color}
          />
          <div
            className={`absolute inset-0 rounded-full ${currentTheme.color.replace(
              "text",
              "bg"
            )} opacity-20 blur-md group-hover:opacity-30 transition-opacity`}
          ></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute right-0 mt-2 py-2 w-56 rounded-lg shadow-lg bg-card border border-border z-50">
            <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
              Select Theme
            </div>
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-muted transition-colors ${
                    theme === t.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative">
                    {theme === t.id && (
                      <div
                        className={`absolute inset-0 rounded-full ${t.color.replace(
                          "text",
                          "bg"
                        )} opacity-20 blur-sm`}
                      ></div>
                    )}
                    <Icon className={`w-5 h-5 ${t.color}`} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">{t.name}</span>
                    {theme === t.id && (
                      <span className={`text-xs ${t.color}`}>Active</span>
                    )}
                  </div>
                  {theme === t.id && (
                    <svg
                      className={`w-4 h-4 ml-auto ${t.color}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;